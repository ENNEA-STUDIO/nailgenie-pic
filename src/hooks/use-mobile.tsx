
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const [isIOS, setIsIOS] = React.useState<boolean>(false)

  React.useEffect(() => {
    // More comprehensive iOS detection
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    // Check for iOS in multiple ways
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    const isIOSSafari = /Safari/i.test(userAgent) && /Apple Computer/.test(navigator.vendor);
    const isIOSWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(userAgent);
    
    const finalIsIOS = isIOSDevice || isIOSSafari || isIOSWebView;
    setIsIOS(finalIsIOS);
    
    // Detect if screen size is mobile
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Log device detection for debugging
    console.log("Device detection:", { 
      isMobile: window.innerWidth < MOBILE_BREAKPOINT, 
      isIOS: finalIsIOS,
      isIOSDevice,
      isIOSSafari,
      isIOSWebView,
      userAgent,
      vendor: navigator.vendor
    });
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Return true if either the screen is mobile size or the device is iOS
  return !!isMobile || isIOS
}
