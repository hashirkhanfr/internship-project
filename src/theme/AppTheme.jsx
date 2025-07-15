import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { inputsCustomizations } from './customizations/inputs.jsx';
import { dataDisplayCustomizations } from './customizations/dataDisplay.jsx';
import { feedbackCustomizations } from './customizations/feedback.jsx';
import { navigationCustomizations } from './customizations/navigation.jsx';
import { surfacesCustomizations } from './customizations/surfaces.js';
import { colorSchemes, typography, shadows, shape } from './themePrimitives.js';

function AppTheme(props) {
  const { children, disableCustomTheme, themeComponents } = props;
  const theme = React.useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
          // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
          cssVariables: {
            colorSchemeSelector: 'data-mui-color-scheme',
            cssVarPrefix: 'template',
          },
          colorSchemes, // Recently added in v6 for building light & dark mode app, see https://mui.com/material-ui/customization/palette/#color-schemes
          typography,
          shadows,
          shape,
          components: {
            ...inputsCustomizations,
            ...dataDisplayCustomizations,
            ...feedbackCustomizations,
            ...navigationCustomizations,
            ...surfacesCustomizations,
            ...themeComponents,
          },
        });
  }, [disableCustomTheme, themeComponents]);
  
  if (disableCustomTheme) {
    return <>{children}</>;
  }
  
  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}

export default AppTheme;
