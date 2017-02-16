import Confirmation from './components/Confirmation';
import CreateConfirmation from './CreateConfirmation';

const Confirm = CreateConfirmation(Confirmation);

export default function (confirmation, options = {}) {
    return Confirm({confirmation, ...options});
}