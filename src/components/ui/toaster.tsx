import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
  <ToastProvider swipeDirection="down" duration={4000}>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport className="fixed bottom-4 left-1/2 -translate-x-1/2 m-0 flex max-h-screen w-full max-w-[calc(100%-2rem)] flex-col-reverse gap-2 p-0 outline-none sm:bottom-4 sm:right-4 sm:left-auto sm:translate-x-0 sm:max-w-sm" />
    </ToastProvider>
  )
}
