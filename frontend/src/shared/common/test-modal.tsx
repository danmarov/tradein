import { Button } from "@/shared/ui/button";
import { CustomIcon } from "@/shared/ui/custom-icon";
import { Modal, ModalFooter, ModalHeader, useModal } from "../ui/modal";

// Пример 1: Базовое использование
function BasicModalExample() {
  return (
    <Modal
      trigger={
        <Button icon={<CustomIcon.Steam />} className="ml-auto">
          Log in with steam
        </Button>
      }
      title="Steam Login"
    >
      <div className="space-y-4">
        <p className="text-gray-300">
          Connect your Steam account to access trading features.
        </p>
        <div className="flex items-center space-x-4">
          <Button className="flex-1">Continue with Steam</Button>
          <Button variant="ghost" className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Пример 2: Модалка без кнопки закрытия и с отключенным backdrop
function RestrictedModal() {
  return (
    <Modal
      trigger={<Button>Open Restricted Modal</Button>}
      title="Important Action"
      showCloseButton={false}
      closeOnBackdrop={false}
      closeOnEscape={false}
    >
      <div className="space-y-4">
        <p className="text-gray-300">
          This action cannot be cancelled. Are you sure you want to proceed?
        </p>
        <ModalFooter>
          <Button variant="ghost">Cancel</Button>
          <Button>Confirm</Button>
        </ModalFooter>
      </div>
    </Modal>
  );
}

// Пример 3: Большая модалка с кастомным размером
function LargeModal() {
  return (
    <Modal
      trigger={
        <Button className="size-full text-base">
          Send exchange offer
          <CustomIcon.ArrowLeft />
        </Button>
      }
      title="Select recipient"
      size="lg"
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Search by nickname"
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />

          <div className="h-[270px] space-y-2 overflow-y-auto">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-md bg-white/5 p-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600">
                    <span className="text-xs text-white">P</span>
                  </div>
                  <div>
                    <div className="text-sm text-white">PlayboyCarti</div>
                    <div className="text-xs text-gray-400">41 exchanges</div>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  Select
                </Button>
              </div>
            ))}
          </div>
        </div>

        <ModalFooter>
          <Button variant="ghost">Cancel</Button>
          <Button>Send exchange offer</Button>
        </ModalFooter>
      </div>
    </Modal>
  );
}

// Пример 5: Вложенные модалки
function NestedModalsExample() {
  return (
    <Modal
      trigger={<Button className="text-lg">Open First Modal</Button>}
      title="First Modal"
    >
      <div className="space-y-4">
        <p className="text-gray-300">This is the first modal.</p>

        <Modal
          trigger={<Button variant="ghost">Open Second Modal</Button>}
          title="Second Modal"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-300">This is a nested modal!</p>
            <ModalFooter>
              <Button>Got it</Button>
            </ModalFooter>
          </div>
        </Modal>
      </div>
    </Modal>
  );
}

export { BasicModalExample, RestrictedModal, LargeModal, NestedModalsExample };
