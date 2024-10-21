import NonIdealState from '../../../components/NonIdealState';
import { useAppStore } from '../../../store';

export default function JournalList({}) {
    const journals = useAppStore(state => state.journals);

    return (
        <>
            {journals.length === 0 && (
                <NonIdealState
                    icon='notebook-multiple'
                    title='No journal entries'
                    message='Add a new journal entry by clicking the + button below'
                />
            )}
        </>
    );
}
