import { IModule, IModuleList } from '../model/module';

export default class CompReg {

    public static getInstance() {
        if (!CompReg.instance) {
            CompReg.instance = new CompReg();
        }
        return CompReg.instance;
    }
    private static instance: CompReg
    private registries: IModuleList
    private constructor() {
        this.registries = {}
    }
    public register(md: IModule): void {
        this.registries[md.name] = md
    }
    public modules(): IModuleList {
        return this.registries
    }
}