// Header.tsx (root level)
// This file re-exports the named Header export from the actual component
// in './components/Header'.
import { Header as ActualHeaderComponent } from './components/Header';
export const Header = ActualHeaderComponent;
// You could also use: export { Header } from './components/Header';
// But the explicit import and re-export is chosen for consistency with other root files.