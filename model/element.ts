export interface IElement {
    Name: string;
    Label: string;
    Category: string;
    Controller: string;
    NewWindow: boolean;
    SignStr?: string;
}
export function elementRouterURL(ele: IElement): string {
    return "/front/" + encodeURIComponent(ele.Name);
}