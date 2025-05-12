export const backMapLinks = (d3Links:any, d: any, style?:any, className?: string, id?:string) => {
    if (!d?.parent) return;
  
    const linkIdentifier=d3Links.selectAll(`#link-${d.data.id}`);
    const parentIdentifier=d3Links.selectAll(`#link-${d.parent.data.id}`);
    if(!linkIdentifier)throw new Error(" NO IDENTIFIER FOR LINK IN (D3 TREE");
    // console.log(d,linkIdentifier)
    if(className){
      linkIdentifier.attr('class', className)
      parentIdentifier.attr('class', className)
      // linkIdentifier.classList+= (` ${className}`);
      // parentIdentifier.classList+= (` ${className}`);
    }
    if(style){
      linkIdentifier.style(Object.keys(style), Object.values(style));
      parentIdentifier.style(Object.keys(style), Object.values(style));
    }
    // console.log(className,linkIdentifier.classList)
    backMapLinks(d3Links, d.parent, style, className)
    return;
  }
