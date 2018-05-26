import { IModule } from '../model/module';
import reg from './reg';

const register = (md: IModule) => {
    reg.getInstance().register(md)
}
const modules = () => reg.getInstance().modules()
export { register, modules }