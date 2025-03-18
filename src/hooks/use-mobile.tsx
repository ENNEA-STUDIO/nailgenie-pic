
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export interface DeviceInfo {
  isMobile: boolean;
  isIOS: boolean;
  isSafari: boolean;
}

export function useIsMobile(): DeviceInfo {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [isIOS, setIsIOS] = React.useState<boolean>(false)
  const [isSafari, setIsSafari] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Get user agent
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    // More robust checks for Safari and iOS
    // Safari has "Safari" in UA and "Apple Computer" in vendor
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(userAgent) && 
                            /Apple Computer/.test(navigator.vendor);
    
    // iOS detection - multiple patterns to catch different iOS scenarios
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    const isIOSSafari = isSafariBrowser && /Mobile|iPad|iPhone|iPod/.test(userAgent);
    const isIOSWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(userAgent);
    
    const finalIsIOS = isIOSDevice || isIOSSafari || isIOSWebView;
    
    setIsIOS(finalIsIOS);
    setIsSafari(isSafariBrowser);
    
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
      isSafari: isSafariBrowser,
      isIOSDevice,
      isIOSSafari,
      isIOSWebView,
      userAgent,
      vendor: navigator.vendor
    });
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Return object with all detection flags
  return {
    isMobile,
    isIOS,
    isSafari
  }
}
