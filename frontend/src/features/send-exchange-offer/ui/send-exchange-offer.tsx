"use client";
import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { CustomIcon } from "@/shared/ui/custom-icon";
import { Input } from "@/shared/ui/input";
import { Modal, ModalFooter, useModal } from "@/shared/ui/modal";
import { CircleAlert, Loader2, Search, User } from "lucide-react";
import { useUserSearch } from "@/features/search-users";
import Image from "next/image";
import { cn } from "@sglara/cn";
import { useRouter } from "next/navigation";
import { Avatar } from "@/shared/ui/avatar";

interface SendExchangeOfferProps {
  className?: string;
}

export function SendExchangeOffer({ className }: SendExchangeOfferProps) {
  const modal = useModal();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const router = useRouter();
  const { data: users = [], isLoading, error } = useUserSearch(searchQuery);

  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId);
    // Здесь можно добавить дополнительную логику
  };

  const handleSendOffer = () => {
    if (!selectedUser) return;

    // Логика отправки предложения
    router.push(`/trade/${selectedUser}`);
    modal.closeModal();

    // Сброс состояния
    setSelectedUser(null);
    setSearchQuery("");
  };

  return (
    <Modal
      open={modal.isOpen}
      onOpenChange={(open) => {
        modal.setIsOpen(open);
        if (!open) {
          // Сброс при закрытии
          setSelectedUser(null);
          setSearchQuery("");
        }
      }}
      trigger={
        <Button className={className}>
          Send exchange offer
          <CustomIcon.ArrowLeft />
        </Button>
      }
      title="Select recipient"
      size="lg"
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <Input
            placeholder="Search by nickname"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            prefix={<Search size={16} />}
            suffix={
              isLoading ? <Loader2 size={16} className="animate-spin" /> : null
            }
          />

          <div className="h-[270px] space-y-2 overflow-y-auto">
            {error && (
              <div className="flex items-center justify-center py-8 text-red-400">
                Failed to load users
              </div>
            )}

            {!error && users.length === 0 && !isLoading && (
              <div className="flex items-center justify-center py-8 text-gray-400">
                {searchQuery ? (
                  <div className="">
                    <div className="mx-auto grid size-[35px] place-items-center rounded-sm bg-[#ef305414] text-[#ef3054]">
                      <CircleAlert className="size-5" />
                    </div>
                    <p className="text-muted my-4 text-center text-sm font-medium">
                      No users were found matching your search criteria. <br />
                      Try searching a different query
                    </p>
                    <Button
                      variant={"secondary"}
                      className="mx-auto block"
                      onClick={() => setSearchQuery("")}
                    >
                      Reset Search
                    </Button>
                  </div>
                ) : (
                  "Start typing to search users"
                )}
              </div>
            )}

            {users.map((user) => (
              <div
                key={user.id}
                className={cn(
                  "flex items-center justify-between rounded-md border border-transparent p-3 transition-colors",
                  selectedUser === user.id
                    ? "border border-blue-500/50 bg-blue-500/20"
                    : "bg-white/5",
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative size-8">
                    <Avatar
                      className="size-8"
                      src={user.avatar}
                      name={user.username}
                    />
                    {user.online && (
                      <span className="absolute right-0 size-2 -translate-y-1/3 rounded-full bg-green-500" />
                    )}
                  </div>

                  <div>
                    <div className="text-sm font-medium text-white">
                      {user.username}
                    </div>
                    <div className="text-xs text-gray-400">
                      50 exchanges
                      {/* {user.exchangeCount} */}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={selectedUser === user.id ? "default" : "secondary"}
                  onClick={() => handleUserSelect(user.id)}
                >
                  {selectedUser === user.id ? "Selected" : "Select"}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <ModalFooter>
          <Button variant="ghost" onClick={modal.closeModal}>
            Cancel
          </Button>
          <Button onClick={handleSendOffer} disabled={!selectedUser}>
            Send exchange offer
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
}
