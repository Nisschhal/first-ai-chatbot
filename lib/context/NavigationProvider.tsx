import { createContext, useState } from "react"

interface NavigationContextProps {
  isMobileNavOpen: boolean
  setIsMobileNavOpen: (isMobileNavOpen: boolean) => void
  closeMobileNav: () => void
}

/**
 * Context for navigation state with initial value as structure.
 *
 * This context provides the state of the sidebar and the functions to control it.
 */
export const NavigationContext = createContext<NavigationContextProps>({
  isMobileNavOpen: false,
  setIsMobileNavOpen: () => {},
  closeMobileNav: () => {},
})

/**
 * Provider for the navigation context.
 *
 * This provider wraps the children components and provides them with the
 * navigation context, which includes the state of the sidebar and the
 * functions to control it.
 *
 * @param children The React children components to be wrapped.
 */
export const NavigationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  // state for toggling side bar
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  // function to close side bar
  const closeMobileNav = () => setIsMobileNavOpen(false)

  return (
    <NavigationContext.Provider
      value={{
        isMobileNavOpen,
        setIsMobileNavOpen,
        closeMobileNav: () => setIsMobileNavOpen(false),
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}
