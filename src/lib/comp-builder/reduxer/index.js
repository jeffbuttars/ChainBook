import Factory from '../Factory'
import Connector, {mergeCompConnector} from './Connector'
import PropTypeFromStatePath from './PropTypeFromStatePath'

export default Factory(PropTypeFromStatePath, Connector)
export {Connector, PropTypeFromStatePath, mergeCompConnector}
