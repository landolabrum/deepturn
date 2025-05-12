import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
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

const ThreeTree: React.FC<IThreeTree> = ({
  data,
  selectedData,
  onClick,
  title = 'data',
  open = false,
  variant = 'tidy'
}) => {
  const FONT_SIZE = 10;
  const TITLE_SIZE = (title.length * FONT_SIZE);
  const NODE_SPACING = 20;
  const IS_RADIAL = variant === 'radial';
const {width}=useWindow();
  const svgRef = useRef<SVGSVGElement>(null);
  // const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<any>(null);
  const { treeData } = useTreeData({ title, data });


  const update = (source: any,i:number) => {
  const container = containerRef?.current;
    const treeLayout = IS_RADIAL
    ? d3.tree().size([2 * Math.PI, Math.min(container.offsetWidth, container.offsetHeight) / 2])
    : d3.tree().size([container.offsetHeight, container.offsetWidth]);

    const layout = treeLayout(source);
      treeLayout(source);

  const svg: any = d3.select(svgRef.current)
    .attr('class', 'd3-svg')
    .attr('width', container.offsetWidth)
    .attr('height', container.offsetHeight)

    .attr('viewBox', IS_RADIAL
      ? `-${container.offsetWidth / 2} -${container.offsetHeight / 2} ${container.offsetWidth} ${container.offsetHeight}`
      : `0 0 ${container.offsetWidth} ${container.offsetHeight}`);

  svg.selectAll('*').remove();

  const d3Links = svg.append('g').attr('class', 'd3-links');
  const d3Nodes = svg.append('g').attr('class', 'd3-nodes').attr('id', 'd3-nodes')
    const nodes = layout.descendants();
    const links = layout.links();
    const colCount = nodes[nodes.length - 1]?.depth + 1;

    if (IS_RADIAL) {
      nodes.forEach((d: any) => {
        d.x = d.x * 180 / Math.PI;
        d.y = d.y;
      });
    } else {
      nodes.forEach((d: any) => {
        d.y = d.depth ? d.depth * (container.offsetWidth / colCount) : TITLE_SIZE;
      });
    }

    nodes.forEach((d: any) => {
      const newX = d.depth;
      // const newX = NODE_SPACING * d.depth;
      d.x += newX;
    });

    // Initialize x0 and y0 if not defined
    nodes.forEach((d: any) => {
      if (d.x0 === undefined) d.x0 = d.x;
      if (d.y0 === undefined) d.y0 = d.y;
    });

    const node: any = d3Nodes.selectAll('g.node')
      .data(nodes, (d: any) => d.id || (d.id = ++i));
    const nodeEnter = node.enter().append('g')
      .attr('class', (d: any) => {
        let hasChildren = d3NodeHasChildren(d);

        return `node d3-node ${hasChildren ? 'd3-node__path' : selectedData && !hasChildren && selectedData?.id && selectedData.id == d.data.id?'d3-node__selected':'d3-node__content'}`
      })
      .attr('transform', (d: any) => {
        if (IS_RADIAL) return `rotate(${d.x}) translate(${d.y},0)`;
        else return `translate(${source.y0},${source.x0})`;
      })
      .on('mouseover', (event: any, d: any) => {
        const currentNode = event.currentTarget;
        const nodeName = currentNode.lastChild.firstChild;

        // first link

        // const backMapLinks = (d: any, style:any, id?:string) => {
        //   if (!d.parent) return;
        //   if(id)d3Links.selectAll(`#link-${d.data.id}`).style(Object.keys(style), Object.values(style));
        //   d3Links.selectAll(`#link-${d.parent.data.id}`).style(Object.keys(style), Object.values(style));
        //   backMapLinks(d.parent, style)
        // }
        backMapLinks(d3Links, d, undefined, 'd3-link--lighting', d.data.id);
        
        // currentNode.lastChild.firstChild.classList += '--hover'
        // currentNode.select(`.d3-node__foreign`).classes('dev', true)
        
        // d3.select(currentNode).classed('d3-node--hover', true);
      })
      .on('mouseout', (event: any, d: any) => {
        backMapLinks(d3Links, d, undefined, 'd3-link--lighting_out', d.data.id);

        // const currentNode = event.currentTarget;
        // d3.select(currentNode).classed('d3-node--hover', false);
        // d3Links.selectAll(`.link-${d.data.id}`).style('stroke', null);
      })
      .on('click', (event: any, d: any) => {
        // console.log({ data: d.data });
        onClick?.(d.data);

        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        // update(d, );
      });

    D3TreeNode(nodeEnter, FONT_SIZE, title);

    const nodeUpdate = nodeEnter.merge(node);
    const lastNode = nodes[nodes.length - 1];
    if (lastNode) {
      // console.log({
      //   x: lastNode.x,
      //   y: lastNode.y,
      //   x0: lastNode.x0 + TITLE_SIZE,
      //   y0: lastNode.y0 + TITLE_SIZE,
      // });
      // containerRef.current.style.width = `${lastNode.x0}px`;
      containerRef.current.style.minHeight = `calc(${lastNode.y + NODE_SPACING}px)`;
      containerRef.current.style.padding = `var(--s-9)`;
    }

    nodeUpdate.transition()
      .duration(200)
      .attr('transform', (d: any) => {
        if (IS_RADIAL) return `rotate(${d.x - 90}) translate(${d.y},0)`;
        else return `translate(${d.y},${d.x})`;
      });

    const nodeExit = node.exit().transition()
      .duration(200)
      .attr('transform', (d: any) => `translate(${source.y},${source.x})`)
      .remove();

    nodeExit.select('circle')
      .attr('r', 1e-6);

    nodeExit.select('text')
      .style('fill-opacity', 1e-6);

    const link: any = d3Links.selectAll('path.link')
      .data(links, (d: any) => d.target.id);

    const linkEnter = link.enter().insert('path', 'g')
      .attr('id', (d: any) => `link-${d.target.data.id}`)
      .attr('class', 'link')
      .attr('d', (d: any) => {
        const o = { x: source.x0, y: source.y0 };
        return IS_RADIAL ? radialDiagonal(o, o) : tidyDiagonal(o, o);
      });

    const linkExit = link.exit().transition()
      .duration(200)
      .attr('d', (d: any) => {
        const o = { x: source.x, y: source.y };
        return IS_RADIAL ? radialDiagonal(o, o) : tidyDiagonal(o, o);
      })
      .remove();

    const linkUpdate = linkEnter.merge(link);
    linkUpdate.transition()
      .duration(200)
      .attr('d', (d: any) => IS_RADIAL ? radialDiagonal(d.source, d.target) : tidyDiagonal(d.source, d.target));

    nodes.forEach((d: any) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  };








  useEffect(() => {
    if (!treeData || !svgRef.current || !containerRef?.current.offsetWidth) return;
    const root: any = d3.hierarchy(treeData, d => d.children || d._children);
    ;

    


    let i = 0;
    root.x0 = containerRef.current.offsetHeight / 2;
    root.y0 = 10;
    update(root,  i);
  }, [containerRef.current, variant, treeData, svgRef.current, width, selectedData]);



  // useEffect(() => {
  //   console.log(containerRef)
  //   if(!svgRef?.current?.classList)return;
  //   const testSize = () =>{
  //     const d3Nodes:any|null = document.getElementById('d3-nodes')
  //     if(d3Nodes != null ){
  //       const {width,height} = d3Nodes.getBBox();
  //       console.log({width, height});
  //     }
  //   }
  //   testSize()
  // }, [containerRef.current, variant, treeData, svgRef.current]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='three-tree' ref={containerRef}>
        <svg ref={svgRef}></svg>
      </div>
    </>
  );
};

export default ThreeTree;
