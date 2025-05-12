import createBuildDate from "@webstack/helpers/createBuildDate"
import environment from "~/src/core/environment"

export default function ProjectBuildDate() { 
    const name = environment.merchant.name;
    const about = environment.merchant.settings?.about;
    return <span style={{ display: 'none' }}>
        {name} | {about?.title} | {about?.description} |    
    {`BUILD DATE: ( ${createBuildDate()} )`}
    </span>
}