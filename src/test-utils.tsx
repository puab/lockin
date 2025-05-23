import { render } from '@testing-library/react-native';
import { AppProviders } from '../App';

const customRender = (ui, options?) =>
    render(ui, { wrapper: AppProviders, ...options });

// re-export everything
export * from '@testing-library/react-native';

// override render method
export { customRender as render };
