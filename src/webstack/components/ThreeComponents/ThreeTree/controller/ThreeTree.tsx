import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import type { Selection, BaseType } from 'd3';
import styles from "./ThreeTree.scss";
import useTreeData from '../hooks/useTreeData';
import { tidyDiagonal } from '../functions/TidyD3Layout';
import { radialDiagonal } from '../functions/RadialD3Layout';
import D3TreeNode, { d3NodeHasChildren } from '../views/D3TreeNode';
import { backMapLinks } from '../functions/D3TreeGeneral';
import useWindow from '@webstack/hooks/window/useWindow';

interface IThreeTree {
  selectedData?: any;
  data: any;
  onClick?: (e: any) => void;
  width?: number;
  height?: number;
  open?: boolean;
  title?: string;
  variant?: 'tidy' | 'radial';
}

const VERTICAL_SPACING_FACTOR = 0.5;

const ThreeTree: React.FC<IThreeTree> = ({
  data,
  selectedData,
  onClick,
  title = 'data',
  open = false,
  variant = 'tidy'
}) => {
  const FONT_SIZE = 10;
  const TITLE_SIZE = title.length * FONT_SIZE;
  const NODE_SPACING = 20; // Increased spacing between nodes vertically
  const IS_RADIAL = variant === 'radial';
  const { width } = useWindow();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('translate(0,0)');
  const [contentHeight, setContentHeight] = useState(0);
  const { treeData } = useTreeData({ title, data });

  const update = (source: any, i: number) => {
    const container = containerRef.current;
    if (!container) return;

    const treeLayout = IS_RADIAL
      ? d3.tree().size([2 * Math.PI, Math.min(container.offsetWidth, container.offsetHeight) / 2])
      : d3.tree().nodeSize([NODE_SPACING, container.offsetWidth / 3]); // Use nodeSize instead of size for precise control
    const layout = treeLayout(source);
    const svg = d3.select(svgRef.current as SVGSVGElement)
      .attr('class', 'd3-svg')
      .attr('width', '100%')
      .attr('height', contentHeight || '100%')
      .attr('viewBox', IS_RADIAL
        ? `-${container.offsetWidth / 2} -${container.offsetHeight / 2} ${container.offsetWidth} ${container.offsetHeight}`
        : `0 0 ${container.offsetWidth} ${contentHeight || container.offsetHeight}`);

    svg.selectAll('*').remove();

    const d3ZoomGroup = svg.append('g').attr('class', 'zoom-group').attr('transform', transform);
    const d3Links = d3ZoomGroup.append('g').attr('class', 'd3-links');
    const d3Nodes = d3ZoomGroup.append('g').attr('class', 'd3-nodes').attr('id', 'd3-nodes');

    const nodes = layout.descendants();
    const links = layout.links();
    const colCount = nodes[nodes.length - 1]?.depth + 1;

    if (IS_RADIAL) {
      nodes.forEach((d: any) => d.x = d.x * 180 / Math.PI);
    } else {
      nodes.forEach((d: any) => {
        d.y = d.depth ? d.depth * (container.offsetWidth / (colCount + 1)) : TITLE_SIZE;
      });
    }

// Update the height calculation and initial positioning
if (!IS_RADIAL) {
  // Get all the y positions (vertical coordinates) of the nodes
  const yPositions = nodes.map((d: any) => d.x);
  const minY = d3.min(yPositions) || 0;
  const maxY = d3.max(yPositions) || 0;
  
  // Calculate the total vertical span of the tree
  const verticalSpan = maxY - minY;
  
  // Add padding above and below the tree
  const calculatedHeight = verticalSpan + NODE_SPACING * 3;
  setContentHeight(calculatedHeight);
  
  // Calculate the vertical center offset
  const verticalCenterOffset = (calculatedHeight - verticalSpan) / 2 - minY;
  
  // Adjust the initial position to center the tree vertically
  source.x0 = verticalCenterOffset;
  
  // Update the transform to center the tree
  setTransform(`translate(0,${verticalCenterOffset})`);
}

    const node = d3Nodes.selectAll<SVGGElement, any>('g.node')
      .data(nodes, (d: any) => d.id || (d.id = ++i));

    const nodeEnter = node.enter().append('g')
      .attr('class', (d: any) => {
        const hasChildren = d3NodeHasChildren(d);
        const isSelected = selectedData?.id === d.data.id;
        const isZero = d.data?.value === 0;

        let baseClass = 'node d3-node';
        if (isZero) baseClass += ' d3-node--zero';
        else if (hasChildren) baseClass += ' d3-node__path';
        else if (isSelected) baseClass += ' d3-node__selected';
        else baseClass += ' d3-node__content';

        return baseClass;
      })
      .attr('transform', (d: any) => IS_RADIAL ? `rotate(${d.x}) translate(${d.y},0)` : `translate(${source.y0},${source.x0})`)
      .on('mouseover', (event: any, d: any) => {
        backMapLinks(d3Links as any, d, undefined, 'd3-link--lighting', d.data.id);
        d3.select(event.currentTarget).select('circle').classed('d3-link--lighting', true);

        const tooltipText = d.data?.value || d.data?.label || d.data?.name || 'N/A';
        const [x, y] = IS_RADIAL
          ? [d.y * Math.cos(d.x * Math.PI / 180), d.y * Math.sin(d.x * Math.PI / 180)]
          : [d.y + 10, d.x - 10];

        svg.append('text')
          .attr('class', 'node-tooltip')
          .attr('x', x)
          .attr('y', y)
          .attr('text-anchor', 'start')
          .attr('font-size', '12px')
          .attr('fill', '#eee')
          .text(tooltipText);
      })
      .on('mouseout touchend', (event: any) => {
        svg.selectAll('.node-tooltip').remove();
        svg.selectAll('.d3-link--lighting').classed('d3-link--lighting', false);
        d3.select(event.currentTarget).select('circle').classed('d3-link--lighting', false);
      })
      .on('click', (event: any, d: any) => {
        onClick?.(d.data);
        d.children = d.children ? null : d._children;

        const zoomX = IS_RADIAL ? d.y * Math.cos((d.x - 90) * Math.PI / 180) : d.y;
        const zoomY = IS_RADIAL ? d.y * Math.sin((d.x - 90) * Math.PI / 180) : d.x;
        const centerX = container.offsetWidth / 2;
        const centerY = container.offsetHeight / 2;
        const dx = centerX - zoomX;
        const dy = centerY - zoomY;

        const zoomGroup = svgRef.current?.querySelector('.zoom-group');
        if (zoomGroup) {
          d3.select(zoomGroup as BaseType)
            .transition()
            .duration(900)
            .ease(d3.easeCubicOut)
            .attr('transform', `translate(${dx},${dy})`);
        }
      });

    D3TreeNode(nodeEnter, FONT_SIZE, title);

    const nodeUpdate = nodeEnter.merge(node as any);
    const lastNode = nodes[nodes.length - 1];
    if (lastNode) {
      container.style.minHeight = `${contentHeight}px`;
      container.style.padding = `var(--s-9)`;
    }

    nodeUpdate.transition()
      .duration(200)
      .attr('transform', (d: any) => IS_RADIAL ? `rotate(${d.x - 90}) translate(${d.y},0)` : `translate(${d.y},${d.x})`);

    node.exit().transition()
      .duration(200)
      .attr('transform', (d: any) => `translate(${source.y},${source.x})`)
      .remove()
      .select('circle').attr('r', 1e-6);

    const link = d3Links.selectAll<SVGPathElement, any>('path.link')
      .data(links, (d: any) => d.target.id);

    const linkEnter = link.enter().append('path')
      .attr('id', (d: any) => `link-${d.target.data.id}`)
      .attr('class', (d: any) => {
        const isZero = d.target?.data?.value === 0;
        return `link animated-link${isZero ? ' link--zero' : ''}`;
      })
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-width', 1.2)
      .attr('d', (d: any) => {
        const o = { x: source.x0, y: source.y0 };
        return IS_RADIAL ? radialDiagonal(o, o) : tidyDiagonal(o, o);
      });

    linkEnter.merge(link as any).transition()
      .duration(200)
      .attr('d', (d: any) => IS_RADIAL ? radialDiagonal(d.source, d.target) : tidyDiagonal(d.source, d.target));

    linkEnter.each(function (d: any) {
      const path = this as SVGPathElement;
      const g = d3.select(path.parentNode as SVGGElement);

      const particles = Array.from({ length: 3 }).map(() =>
        g.append('circle')
          .attr('r', FONT_SIZE / 2)
          .attr('class', 'link-particle')
      );

      function animate(particle: any, delay: number) {
        particle
          .interrupt()
          .transition()
          .delay(delay)
          .duration(4500)
          .ease(d3.easeQuadOut)
          .attrTween('transform', () => {
            const totalLength = path.getTotalLength();
            return (t: number) => {
              const radius = FONT_SIZE / 4 - t * (FONT_SIZE / 8);
              const opacity = 1 - t * 0.6;
              particle.attr('r', radius).style('opacity', opacity);
              const point = path.getPointAtLength(t * totalLength);
              return `translate(${point.x},${point.y})`;
            };
          })
          .on('end', () => animate(particle, delay));
      }

      particles.forEach((particle, i) => animate(particle, i * 500));
    });

    link.exit().transition()
      .duration(200)
      .attr('d', (d: any) => {
        const o = { x: source.x, y: source.y };
        return IS_RADIAL ? radialDiagonal(o, o) : tidyDiagonal(o, o);
      })
      .remove();

    nodes.forEach((d: any) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  };

useEffect(() => {
  if (!treeData || !svgRef.current || !containerRef?.current?.offsetWidth) return;
  const root: any = d3.hierarchy(treeData, d => d.children || d._children);
  let i = 0;
  root.x0 = 0; // Changed from offsetHeight/2 to 0 since we're handling centering in update
  root.y0 = NODE_SPACING;
  update(root, i);
}, [variant, treeData, width, selectedData, transform, contentHeight]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className='three-tree' ref={containerRef}>
        <svg ref={svgRef} style={{ height: contentHeight }}></svg>
      </div>
    </>
  );
};

export default ThreeTree;