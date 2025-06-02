// This file, located at the project root (Dashboard.tsx),
// is being modified to re-export the default export from the actual component
// in './components/Dashboard'. This is a workaround for potential import
// resolution issues.
// The main Dashboard component is expected to be at 'components/Dashboard.tsx'.
// If this root-level 'Dashboard.tsx' is not intentionally part of your project,
// consider deleting it and ensuring all imports correctly point to './components/Dashboard'.
import ActualDashboardComponent from './components/Dashboard';
export default ActualDashboardComponent;
