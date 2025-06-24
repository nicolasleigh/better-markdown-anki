import { Card, Paper, Stack, Text, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import Markdown from './components/Markdown';


function App() {
  const { colorScheme } = useMantineColorScheme();
  const [cardContent, setCardContent] = useState({
    front: 'Loading...',
    back: 'Loading...',
    extra: 'Loading...'
  });

  /*-------------------------------------------------------------------
   * Solution 2: Proper component lifecycle with cleanup
   *------------------------------------------------------------------*/
  useEffect(() => {
    console.log('[anki-react] App mounted, reading card content...');
    
    // Read content from hidden Anki elements
    const readCardContent = () => {
      const frontEl = document.getElementById('front-card');
      const backEl = document.getElementById('back-card');
      const extraEl = document.getElementById('extra-card');
      console.log('[anki-react] Found elements:', {
        front: frontEl,
        back: backEl,
        extra: extraEl
      });
      return {
        front: frontEl?.textContent?.trim() || 'EMPTY',
        back: backEl?.textContent?.trim() || '', 
        extra: extraEl?.textContent?.trim() || ''
      };
    };

    // Initial content load
    setCardContent(readCardContent());

    // Optional: Watch for dynamic content changes (rare in Anki but possible)
    const observer = new MutationObserver(() => {
      setCardContent(readCardContent());
    });

    // Observe the document for changes to card content elements
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // CRITICAL: Cleanup function (runs when Anki destroys the DOM)
    return () => {
      console.log('[anki-react] App cleanup: disconnecting observers...');
      observer.disconnect();
      // Add any other cleanup here (timers, subscriptions, etc.)
    };
}, []);

  /*-------------------------------------------------------------------
   * Theme-aware color configuration
   *------------------------------------------------------------------*/
  const getThemeColors = () => {
    const isDark = colorScheme === 'dark';
    
    return {
      front: {
        bg: isDark ? 'dark.6' : 'gray.1',
        border: isDark ? 'dark.4' : 'gray.3'
      },
      back: {
        bg: isDark ? 'dark.5' : 'blue.1', 
        border: isDark ? 'blue.8' : 'blue.3'
      },
      extra: {
        bg: isDark ? 'dark.4' : 'yellow.1',
        border: isDark ? 'yellow.8' : 'yellow.3'
      }
    };
  };

  const colors = getThemeColors();

  /*-------------------------------------------------------------------
   * Helper function for consistent border styling
   *------------------------------------------------------------------*/
  const getBorderStyle = (borderColor) => (theme) => {
    const [colorKey, shadeStr] = borderColor.split('.');
    const shade = parseInt(shadeStr, 10);
    return { border: `1px solid ${theme.colors[colorKey][shade]}` };
  };

  /*-------------------------------------------------------------------
   * Render card sections
   *------------------------------------------------------------------*/
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Stack gap="md">
        {/* Front section */}
        <div>
          <Text fw={600} size="sm" mb="xs" c="dimmed">
            FRONT
          </Text>
          <Paper
            p="md"
            bg={colors.front.bg}
            style={getBorderStyle(colors.front.border)}
            radius="sm"
          >
            <Markdown>{cardContent.front}</Markdown>
          </Paper>
        </div>

        {/* Back section */}
        {cardContent.back && (<div>
          <Text fw={600} size="sm" mb="xs" c="dimmed">
            BACK
          </Text>
          <Paper 
            p="md" 
            bg={colors.back.bg}
            style={getBorderStyle(colors.back.border)}
            radius="sm"
          >
            <Markdown>{cardContent.back}</Markdown>
          </Paper>
        </div>)}

        {/* Extra section (fixed the typo: was "FRONT", now "EXTRA") */}
        {cardContent.extra && (<div>
          <Text fw={600} size="sm" mb="xs" c="dimmed">
            EXTRA
          </Text>
          <Paper
            p="md"
            bg={colors.extra.bg}
            style={getBorderStyle(colors.extra.border)}
            radius="sm"
          >
            <Markdown>{cardContent.extra}</Markdown>
          </Paper>
        </div>)}
      </Stack>
    </Card>
  );
}

export default App;
