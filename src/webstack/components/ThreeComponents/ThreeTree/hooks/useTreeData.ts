import { useEffect, useState } from "react";
interface IUseTreeData{
    title?:string;
    data: any;
}
const useTreeData = ({title,data}: IUseTreeData) =>{
  const [treeData, setTreeData] = useState<any>();
  useEffect(() => {
    const convertToTree = (obj: any, parentKey: string = title||'data'): any => {
      const children = Object.entries(obj).map(([key, value]: [string, any]) => {
        let field: any = { id: parentKey ? `${parentKey}-${key}` : key, name: key, value: null };
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          field.children = convertToTree(value, field.id).children;
        } else if (Array.isArray(value)) {
          field.children = value.map((item, index) => {
            const itemIsDict = typeof item === 'object' && item !== null;
            return itemIsDict ? (
              convertToTree(item, `${field.id}-${index}`)
            ) : (
              { id: `${field.id}-${index}`, name: `${key}-${index}`, value: item }
            );
          });
        } else {
          field.value = value;
        }
        return field;
      });
      return { id: parentKey, name: parentKey, children: children };
    };

    if (data) {
      setTreeData({ name: title, children: convertToTree(data).children });
    }
  }, [data, open, title]);
  return {
    treeData
  }
};
export default useTreeData;