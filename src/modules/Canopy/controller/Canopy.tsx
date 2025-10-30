
import React, { useEffect, useState, useCallback, useMemo } from "react";
import styles from "./Canopy.scss";
import CanopyProperties from "../views/CanopyProperties/controller/CanopyProperties";
import CanopyView from "../views/CanopyView/controller/CanopyView";
import useLocalStorage from "@webstack/hooks/storage/useLocalStorage";
import { useRouter } from "next/router";
import { useCanopy } from "../hooks/useCanopy";
import type { EventRow } from "../hooks/useCanopy";
import { useModal } from "@webstack/components/Containers/modal/contexts/modalContext";
import { useNotification } from "@webstack/components/Notification/Notification";
import { getOverlayStream } from "../context/CanopyProvider";
import UiButton from "@webstack/components/UiForm/views/UiButton/UiButton";
import environment from "~/src/core/environment";

export const TABLE_NAME = "livestream_event";
const LS_KEY_CURRENT = "livestream_event:current";

const Canopy: React.FC = () => {

  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const [, setNotification] = useNotification();
  const { events, loadEvents, deleteEvent: deleteEventDb, getOverlaysById } = useCanopy();


  const urlEventId = useMemo(() => {
    if (!router?.isReady) return undefined;
    return (router.query?.event as string) || (router.query?.eventId as string) || (router.query?.id as string);
  }, [router.isReady, router.query]);
  const viewId = useMemo(() => {
    if (!router?.isReady) return ;
    return router.query?.view as string;
  }, [router.isReady, router.query]);
  const [current, setCurrent] = useState<EventRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { setLocalItem, deleteLocalItem, getLocalItem } = useLocalStorage(LS_KEY_CURRENT);

  const readSavedEventId = useCallback((): string | null => {
    try {
      const raw = getLocalItem?.(LS_KEY_CURRENT);
      if (!raw) return null;
      if (typeof raw === "string") return raw;
      if (typeof raw === "object" && "id" in raw) return String((raw as any).id);
      return null;
    } catch {
      return null;
    }
  }, [getLocalItem]);

  // Initial load
  useEffect(() => {
    if (!events || events.length === 0) void loadEvents();
  }, [events?.length, loadEvents]);


  const setUrlEvent = useCallback(
    (id: string | null) => {
      if (!router?.isReady) return;
      const { pathname, query } = router;
      const nextQuery = { ...query };
      if (id) nextQuery.event = id;
      else delete nextQuery.event;
      router.replace({ pathname, query: nextQuery }, undefined, { shallow: true }).catch(() => {});
    },
    []
  );

  const setLsCurrent = useCallback(
    (id: string | null) => {
      try {
        if (id) setLocalItem(LS_KEY_CURRENT, { id });
        else deleteLocalItem(LS_KEY_CURRENT);
      } catch {}
    },
    [setLocalItem, deleteLocalItem]
  );

  // Sync current event from URL / LS
  useEffect(() => {
    if (!router.isReady || !events?.length) return;
    const already = String(current?.id ?? "");

    if (urlEventId) {
      if (already === String(urlEventId)) return;
      const m = events.find((e) => String(e.id) === String(urlEventId)) || null;
      setCurrent(m);
      setLsCurrent(m ? String(m.id) : null);
      return;
    }

    const savedId = readSavedEventId();
    if (savedId && already !== savedId) {
      const m = events.find((e) => String(e.id) === savedId) || null;
      if (m) setCurrent(m);
    }
  }, [router.isReady, events, urlEventId, current?.id, setLsCurrent, readSavedEventId]);

  const handleUserSelect = useCallback(
    (evt: EventRow | null) => {
      const idStr = evt?.id != null ? String(evt.id) : null;
      setCurrent(evt);
      setLsCurrent(idStr);
      setUrlEvent(idStr);
    },
    [setUrlEvent, setLsCurrent]
  );

  // Deletion logic
  const deleteEvent = useCallback(
    async (id?: string) => {
      const targetId = id ?? current?.id;
      if (!targetId) return;

      console.log(`Attempting to delete event with ID: ${targetId}`);

      const label =
        events?.find((e) => String(e.id) === String(targetId))?.name ??
        (current?.id === targetId ? current?.name : undefined) ??
        "this event";

      openModal({
        title: `Delete “${label}”?`,
        confirm: {
          statements: [
            { label: "Cancel", variant: "flat", onClick: () => closeModal() },
            {
              label: "Delete",
              variant: "danger",
              onClick: async () => {
                console.log(`Confirmed delete for event: ${label}`);
                // closeModal();
                setDeletingId(String(targetId));

                // Call deleteEventDb to delete event from the backend
                const ok = await deleteEventDb(String(targetId));

                if (ok) {
                  console.log(`Event with ID ${targetId} deleted successfully.`);
                  // Update localStorage and clear the current event
                  setCurrent((prev) => {
                    if (String(prev?.id ?? "") === String(targetId)) {
                      setUrlEvent(null);
                      setLsCurrent(null);
                      return null;
                    }
                    return prev;
                  });

                  setNotification({
                    active: true,
                    persistence: 3000,
                    dismissable: true,
                    list: [{ label: "Deleted", message: `"${label}"` }],
                  });


                  // Remove event from localStorage
                  try {
                    let updatedEvents = JSON.parse(localStorage.getItem("events") || "[]");
                    updatedEvents = updatedEvents.filter((event: { id: string }) => event.id !== targetId);
                    localStorage.setItem("events", JSON.stringify(updatedEvents));

                    // Optionally, remove the event individually if stored under another key
                    localStorage.removeItem(`livestream_event:${targetId}`);
                  } catch (e) {
                    console.error("Error removing from localStorage:", e);
                  }

                  if (!events?.length) void loadEvents();
                } else {
                  console.log("Event deletion failed.");
                  setNotification({
                    active: true,
                    persistence: 2200,
                    dismissable: true,
                    list: [{ label: "Delete failed", message: "Could not delete event. Refreshed list." }],
                  });
                  await loadEvents();
                }
                setDeletingId(null);
              },
            },
          ],
        },
      });
    },
    [
      current?.id,
      current?.name,
      events,
      deleteEventDb,
      loadEvents,
      setUrlEvent,
      setLsCurrent,
      openModal,
      closeModal,
      setNotification,
    ]
  );

  // Overlay subscription (fixed: no spam reload loop)
  useEffect(() => {
    if (!current?.id) return;

    const overlayUrl = `/api/db/overlay_stream?event_id=${current.id}`;

    let inFlight = false;
    let lastRun = 0;
    const THROTTLE_MS = 1500;

    const unsubscribe = getOverlayStream(String(current.id), overlayUrl, () => {
      const now = Date.now();
      if (inFlight) return;
      if (now - lastRun < THROTTLE_MS) return;

      inFlight = true;
      Promise.resolve(getOverlaysById(String(current.id), { force: true })).finally(() => {
        inFlight = false;
        lastRun = Date.now();
      });
    });

    return () => {
      unsubscribe?.();
    };
  }, [current?.id, getOverlaysById,]);
  const callLando = () => {
    openModal({
      confirm: {
        title: "Get Help Fast!",
        body: "(local storage needs populated) in worst case scenerio, I just finished coding at 7:30am, im dead..",
        statements: [
          {
            href: "tel://+14357773178",
            label: "call lando @ +14357773178",
            variant: "link",
          },
        ],
      },
    });
  };
  if (viewId == "nav")
    return (
      <CanopyProperties
        isDock
        current={current}
        events={events}
        setCurrent={handleUserSelect}
        onDelete={(e?: string) => {
          void deleteEvent(e);
        }}
        deletingId={deletingId ?? undefined}
      />
    );
    if(viewId=='controls')return<CanopyView current={current} view={viewId} />

  return (
    <>
      <style jsx>{styles}</style>
      <div className="canopy">
        {/* <Social
platform='instagram'
 user={user}
/> */}
        <span className="error notice ">
          Notice from the developer: if it glitches, refresh the page. or
          <UiButton onClick={callLando} variant="link">
            more help
          </UiButton>
        </span>
        <div className="canopy__header">
          <div className="canopy__header--title">
              {current?.name || "LiveStream Visual Controller"}
            <div>Canopy <small>v4.3</small></div>
          </div>
        </div>

        <div className="canopy__content">
          <div className="canopy--nav">
            <CanopyProperties
              current={current}
              events={events}
              setCurrent={handleUserSelect}
              onDelete={(e?: string) => {
                void deleteEvent(e);
              }}
              deletingId={deletingId ?? undefined}
            />
            
          </div>
          <div className="canopy--view" aria-busy={!!deletingId}>
            <CanopyView current={current} view={viewId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Canopy;
