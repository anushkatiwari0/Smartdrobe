
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function StyledDialog({ title, hideTitle = false, children }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
        Open Dialog
      </Dialog.Trigger>

      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

        {/* Content */}
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
          
          {/* Dialog Title (conditionally hidden) */}
          {hideTitle ? (
            <VisuallyHidden>
              <Dialog.Title>{title}</Dialog.Title>
            </VisuallyHidden>
          ) : (
            <Dialog.Title className="text-xl font-bold text-gray-900">
              {title}
            </Dialog.Title>
          )}

          {/* Content */}
          <div className="text-gray-700">
              {children}
          </div>

          {/* Buttons */}
          <div className="mt-4 flex justify-end gap-2">
            <Dialog.Close className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition">
              Close
            </Dialog.Close>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
