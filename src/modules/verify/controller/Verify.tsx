import React, { useEffect, useMemo, useState } from 'react';
import styles from './Verify.scss';
import { useRouter } from 'next/router';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import { getService } from '@webstack/common';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import VerifyEmail from '../views/VerifyEmail/VerifyEmail';

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION?.trim();

type VerifyContext =
  | null
  | {
      view?: string;
      code?: number;
      error?: boolean;
      message?: string;
      status?: string;
      [k: string]: any;
    };

const DefaultVerifyView: React.FC = () => (
  <>
    <style jsx>{styles}</style>
    <div className="verify__default">
      <h1>Verify</h1>
      <p>Enter via a verification link that includes a token.</p>
    </div>
  </>
);

const VerifyErrorView: React.FC<{ view?: string; name?: string; message?: string }> = (props) => (
  <>
    <style jsx>{styles}</style>
    <div className="verify__error" id={props.view}>
      <h3>¡Error!</h3>
      <div className="verify__error-header">
        Verify: <span className="c-error">{props?.name && keyStringConverter(props?.name)}</span>
      </div>
      <p>{props?.message}</p>
      <span className="error--more-info">
        If you think you are seeing this in error, please contact your admin.
      </span>
    </div>
  </>
);

const Verify: React.FC = () => {
  const router = useRouter();
  const MemberService = getService<IMemberService>('IMemberService');

  const [ctx, setCtx] = useState<VerifyContext>(null);
  const [loading, setLoading] = useState(false);

  const { vid, token } = useMemo(() => {
    if (!router.isReady) return { vid: undefined, token: undefined };
    const q = router.query;
    return {
      vid: typeof q?.vid === 'string' ? q.vid : undefined,
      token: typeof q?.token === 'string' ? q.token : undefined,
    };
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!router.isReady) return;
    setLoading(true);

    (async () => {
      if (!vid) {
        setCtx({ view: 'no-view-id', code: 404, error: true, message: 'No verification type (vid) in the URL.' });
        setLoading(false);
        return;
      }
      if (!token) {
        setCtx({ view: 'no-token', code: 400, error: true, message: 'No token present in the URL.' });
        setLoading(false);
        return;
      }

      try {
        if (vid === 'email') {
          if (!ENCRYPTION_KEY) {
            setCtx({ view: 'no-encryption-key', code: 500, error: true, message: 'Missing NEXT_PUBLIC_ENCRYPTION.' });
            return;
          }
          const verified = await MemberService.decryptJWT({
            token,
            secret: ENCRYPTION_KEY,
            algorithm: 'HS256',
            verify: false,
          });
          setCtx({ view: 'email', ...verified, token });
          return;
        }

        setCtx({ view: 'no-view-id', code: 404, error: true, message: `Unknown verification type: "${vid}"` });
      } catch (e: any) {
        setCtx({ view: 'verify-error', code: 500, error: true, message: e?.message || 'Verification failed.' });
      } finally {
        setLoading(false);
      }
    })();
  }, [router.isReady, vid, token, MemberService]);

  const viewNode = useMemo(() => {
    if (loading) {
      return (
        <div className="verify__loading">
          <span>Verifying…</span>
        </div>
      );
    }
    if (!ctx) return <DefaultVerifyView />;

    const views: Record<string, React.ReactNode> = {
      'no-view-id': <VerifyErrorView view="no-view-id" name={ctx.view} message={ctx.message} />,
      'no-token': <VerifyErrorView view="no-token" name={ctx.view} message={ctx.message} />,
      'no-encryption-key': <VerifyErrorView view="no-encryption-key" name={ctx.view} message={ctx.message} />,
      'verify-error': <VerifyErrorView view="verify-error" name={ctx.view} message={ctx.message} />,
      email: (
        <VerifyEmail
          token={ctx.token || token}
          onSuccess={() => {
            // could toast or route if you want
          }}
        />
      ),
    };

    return views[ctx.view || ''] ?? <DefaultVerifyView />;
  }, [ctx, loading, token]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className="verify">{viewNode}</div>
    </>
  );
};

export default Verify;
