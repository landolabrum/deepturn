import React, { useRef, useState, useEffect } from 'react';
import styles from './ServicesCarousel.scss';
import { useRouter } from 'next/router';
import ProductImage from '~/src/modules/ecommerce/Services/views/ServiceDescription/views/ProductImage/ProductImage';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import useWindow from '@webstack/hooks/window/useWindow';

interface ServicesCarouselProps {
  products?: any;
}

const ServicesCarousel: React.FC<ServicesCarouselProps> = ({ products }) => {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const scrollByAmount = 200;
const {width}=useWindow();
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1100);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const checkScrollPosition = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, offsetWidth } = el;

    setAtStart(scrollLeft <= 10);
    setAtEnd(scrollLeft + offsetWidth >= scrollWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener('scroll', checkScrollPosition);
    checkScrollPosition();

    return () => el.removeEventListener('scroll', checkScrollPosition);
  }, [products]);

  const scrollLeft = () => {
    alert('left');
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: -scrollByAmount, behavior: 'smooth' });

    // Schedule position check after scroll finishes
    setTimeout(checkScrollPosition, 350);
  };

  const scrollRight = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: scrollByAmount, behavior: 'smooth' });

    setTimeout(checkScrollPosition, 350);
  };

  const handleClick = (productId: string, priceId?: string) => {
    router.push(`/product?id=${productId}&pri=${priceId}`);
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div className="services-carousel">
        <div className="services-carousel__scroll" ref={scrollRef}>
          <div className="services-carousel__inner">
            {products?.length &&
              products.map((product: any) => {
                const priceId = product?.price?.id || product?.default_price;
                const image = product.images?.[0] || '/fallback.png';

                return (
                  <div
                    key={product.id}
                    className="services-carousel__item"
                    onClick={() => handleClick(product.id, priceId)}
                  >
                    <ProductImage image={image} options={width < 1100 && { view: "slider" }} />
                    <span className="services-carousel__label">{product.name}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicesCarousel;
