export const d3NodeHasChildren = (threeNode: any) => threeNode?.children || threeNode?._children;

const D3TreeNode = (m: any, FONT_SIZE: number, title: string) => {
    const createLink = async (m: any) => {
        await m.append('circle').attr('class', 'd3-node--circle');
        return m;
    };

    
    createLink(m).then(m =>
        m.append('foreignObject')
            .attr('y', `-${FONT_SIZE/2}`)
            .attr('x', (d:any)=>d3NodeHasChildren(d)?-( FONT_SIZE):FONT_SIZE)
            .attr('id', (d: any) => `marker-${d.data?.id || title}`)
        
            // .attr('class', 'd3-node__foreign')
            // .attr('width', (d: any) => `${d.data.name.length * 6}px`)
            
            .style('font-size',`${FONT_SIZE}px`)
            .style('height',`${FONT_SIZE*2}px`)
            .style('overflow',`visible`)
            .html((d: any) => `<div class='d3-node--${Boolean(d.data.children) ? "key" : "name"}'>
        ${d.data.name}
        <div class='d3-node--value'>${d.data.value != undefined ? `${d.data.value}` : ''}</div>
        </div>
        `)
    )
};
export default D3TreeNode;