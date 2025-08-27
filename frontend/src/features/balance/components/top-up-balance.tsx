/* eslint-disable @next/next/no-img-element */
"use client";
import { toast } from "sonner";

import { useAuth } from "@/features/auth";
import { CustomIcon } from "@/shared/ui/custom-icon";
import { Modal, useModal } from "@/shared/ui/modal";
import { ReactNode, useState } from "react";
import { useBalance } from "../client";
import { cn, formatPrice } from "@/shared/lib/utils";
import Image from "next/image";
import { Button } from "@/shared/ui/button";
import {
  Lock,
  ArrowLeft,
  ChevronsRight,
  ShieldQuestionMark,
} from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/shared/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { useRouter } from "next/navigation";

const paymentMethods = [
  {
    variant: "crypto" as const,
    title: "Crypto",
    image: "/images/method-crypto.svg",
    fee: 0,
    extraBonus: 35,
    minAmount: 10,
  },
  {
    variant: "card" as const,
    title: "Cards",
    image: "/images/method-card.svg",
    fee: 2.92,
    extraBonus: 35,
    minAmount: 20,
  },
  {
    variant: "paypal" as const,
    title: "PayPal",
    image: "/images/method-paypal.webp",
    fee: 0,
    extraBonus: 35,
    minAmount: 0,
  },
];

// Предустановленные суммы платежей
const predefinedAmounts = [10, 25, 50, 100, 250, 500];

// Функции расчетов
const calculateProcessingFee = (amount: number, feePercent: number): number => {
  return (amount * feePercent) / 100;
};

const calculateBonusAmount = (amount: number, bonusPercent: number): number => {
  return (amount * bonusPercent) / 100;
};

const calculateTotalPayment = (
  amount: number,
  processingFee: number,
): number => {
  return amount + processingFee;
};

const calculateFinalReceived = (
  amount: number,
  bonusAmount: number,
): number => {
  return amount + bonusAmount;
};

const BonusBadge = ({ amount }: { amount: number }) => {
  return (
    <span className="block h-[18px] rounded-sm bg-[#2d3536] px-1 text-xs font-bold leading-[18px] text-[#7ed757]">
      +{amount}%
    </span>
  );
};

interface TopUpBalanceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TopUpItemProps {
  variant: "crypto" | "card" | "paypal";
  onClick?: () => void;
  extraBonus?: number;
  fee?: number;
}

const TopUpItem = ({ variant, extraBonus, onClick }: TopUpItemProps) => {
  const method = paymentMethods.find((m) => m.variant === variant);

  if (!method) return null;

  return (
    <div
      className="relative flex h-[93px] cursor-pointer flex-col justify-between rounded-sm bg-[#252632] pb-2 pt-2.5 transition-colors hover:bg-[#2a2b3a]"
      onClick={onClick}
    >
      <div className="flex h-full flex-col items-center justify-between">
        <div
          className={cn(
            "relative h-[40px] w-full",
            variant === "card" && "h-[30px]",
          )}
        >
          <Image
            src={method.image}
            alt={method.title}
            fill
            className="object-contain"
          />
        </div>
        <div className="text-foreground flex items-center gap-1 text-xs font-bold">
          <span className="">{method.title}</span>

          {extraBonus && extraBonus > 0 ? (
            <BonusBadge amount={extraBonus} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

const PaymentAmountPicker = ({
  amount,
  extraBonus = 0,
  disabled = false,
  active = false,
  onClick,
}: {
  amount: number;
  extraBonus?: number;
  disabled?: boolean;
  active?: boolean;
  onClick?: () => void;
}) => {
  const bonusAmount = calculateBonusAmount(amount, extraBonus);

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-sm border border-[#252632] p-3 text-left text-sm font-semibold transition-colors duration-150 hover:border-[#363745] disabled:cursor-auto disabled:opacity-40",
        active && "border-primary hover:border-active",
        disabled && "border-[#252632] hover:border-[#252632]",
      )}
    >
      {formatPrice(amount)}{" "}
      {bonusAmount > 0 ? (
        <>
          + <span className="text-muted"> {formatPrice(bonusAmount)}</span>
        </>
      ) : null}
    </button>
  );
};

const SelectedMethodView = ({
  method,
  onBack,
  paymentAmount,
  customAmount,
  activeAmountButton,
  onCustomAmountChange,
  onPredefinedAmountClick,
}: {
  method: (typeof paymentMethods)[0];
  onBack: () => void;
  paymentAmount: number;
  customAmount: string;
  activeAmountButton: number;
  onCustomAmountChange: (value: string) => void;
  onPredefinedAmountClick: (amount: number) => void;
}) => {
  // Расчеты
  const processingFee = calculateProcessingFee(paymentAmount, method.fee);
  const bonusAmount = calculateBonusAmount(paymentAmount, method.extraBonus);
  const totalPayment = calculateTotalPayment(paymentAmount, processingFee);
  const finalReceived = calculateFinalReceived(paymentAmount, bonusAmount);

  return (
    <div className="flex h-[490px] flex-col border-t border-[#252632] px-6 pt-8">
      <div className="mb-8 flex items-center justify-between gap-3 rounded-sm bg-[#252632] p-3">
        <div className="flex items-center gap-1">
          <img
            src={method.image}
            alt={method.title}
            className="h-[25px] object-contain"
          />
          <span className="text-sm font-bold">{method.title}</span>
        </div>
        <button
          onClick={onBack}
          className="duration-250 h-[30px] cursor-pointer rounded-sm bg-[#353745] px-4 text-sm font-bold transition-colors hover:bg-[#252632]"
        >
          Change
        </button>
      </div>
      <div>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-1">
            <Input
              label={
                <span className="text-muted flex items-center text-sm font-semibold">
                  Payment amount
                  {method.minAmount && method.minAmount > 0 ? (
                    <Tooltip>
                      <TooltipTrigger className="bg-primary text-foreground ml-1 grid size-4 place-items-center rounded-full font-bold">
                        <span className="">
                          <ShieldQuestionMark size={10} />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        Minimum amount {formatPrice(method.minAmount)}
                      </TooltipContent>
                    </Tooltip>
                  ) : null}
                </span>
              }
              labelClassName="m-0"
              inputClassName="pl-2.5"
              prefix={<span className="text-foreground">$</span>}
              value={customAmount}
              onChange={(e) => onCustomAmountChange(e.target.value)}
              type="number"
              min="1"
              step="0.01"
            />
          </div>
          <div className="col-span-2">
            <p className="flex items-center gap-1">
              <span className="text-muted text-sm font-semibold">
                You will receive
              </span>
              {method.extraBonus && method.extraBonus > 0 ? (
                <BonusBadge amount={method.extraBonus} />
              ) : null}
            </p>
            <div className="mt-2 flex items-center text-2xl font-bold">
              <motion.span
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.2,
                  // delay: 0.3,
                  ease: "easeOut",
                }}
              >
                {formatPrice(paymentAmount)}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: -5, color: "#c8f7a3" }}
                animate={{
                  opacity: 1,
                  x: 0,

                  color: "#89eb5b",
                }}
                transition={{
                  duration: 0.2,
                  delay: 0.2,
                  ease: "easeOut",
                }}
              >
                <ChevronsRight className="text-[#89eb5b]" />
              </motion.span>
              <motion.span
                initial={{
                  opacity: 0,
                  x: -5,
                  color: "#c8f7a3",
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  color: "#89eb5b",
                }}
                transition={{
                  duration: 0.2,
                  delay: 0.4,
                  ease: "easeOut",
                }}
                className="text-[#89eb5b]"
              >
                {formatPrice(finalReceived)}
              </motion.span>
            </div>
          </div>
        </div>

        {/* Второй div - по 3 элемента в ряду */}
        <div className="mt-8 grid grid-cols-3 gap-2">
          {predefinedAmounts.map((amount, index) => (
            <PaymentAmountPicker
              key={amount}
              amount={amount}
              extraBonus={method.extraBonus}
              disabled={amount < method.minAmount ? true : false}
              active={activeAmountButton === amount}
              onClick={() => onPredefinedAmountClick(amount)}
            />
          ))}
        </div>
      </div>
      <div className="grid h-auto flex-1 place-items-center">
        <div className="h-fit w-full space-y-2 text-sm">
          <div className="text-muted flex items-center justify-between font-medium">
            <p>Your Payment</p>
            <p>{formatPrice(paymentAmount)}</p>
          </div>
          <div className="text-muted flex items-center justify-between font-medium">
            <p>Processing fee</p>
            <p>{formatPrice(processingFee)}</p>
          </div>
          <div className="text-foreground flex items-center justify-between font-medium">
            <p>Total payment</p>
            <p>{formatPrice(totalPayment)}</p>
          </div>
          <div className="text-muted flex items-center justify-between font-medium">
            <p>You will receive</p>
            <p className="text-[#89eb5b]">{formatPrice(finalReceived)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TopUpBalance({
  open,
  onOpenChange,
}: TopUpBalanceProps) {
  const { balance, createInvoice, isCreatingInvoice } = useBalance();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<
    (typeof paymentMethods)[0] | null
  >(null);

  // Состояние для расчетов
  const [paymentAmount, setPaymentAmount] = useState<number>(250);
  const [customAmount, setCustomAmount] = useState<string>("250");
  const [activeAmountButton, setActiveAmountButton] = useState<number>(250);

  const handlePaymentMethodClick = (variant: TopUpItemProps["variant"]) => {
    const method = paymentMethods.find((m) => m.variant === variant);
    if (method) {
      setSelectedMethod(method);
      setPaymentAmount(250);
      setCustomAmount("250");
      setActiveAmountButton(250);
    }
  };

  const handleBackToMethods = () => {
    setSelectedMethod(null);
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      setSelectedMethod(null);
    }
    onOpenChange(open);
  };

  // Обработчик изменения кастомной суммы
  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numericValue = parseFloat(value) || 0;
    setPaymentAmount(numericValue);

    // Проверяем, совпадает ли введенная сумма с предустановленной
    const matchedAmount = predefinedAmounts.find(
      (amount) => amount === numericValue,
    );
    setActiveAmountButton(matchedAmount || -1);
  };

  // Обработчик выбора предустановленной суммы
  const handlePredefinedAmountClick = (amount: number) => {
    setPaymentAmount(amount);
    setCustomAmount(amount.toString());
    setActiveAmountButton(amount);
  };

  // Обработчик покупки
  // const handlePurchase = () => {
  //   if (!selectedMethod || paymentAmount <= 0) return;

  //   const processingFee = calculateProcessingFee(
  //     paymentAmount,
  //     selectedMethod.fee,
  //   );
  //   const bonusAmount = calculateBonusAmount(
  //     paymentAmount,
  //     selectedMethod.extraBonus,
  //   );
  //   const totalPayment = calculateTotalPayment(paymentAmount, processingFee);
  //   const finalReceived = calculateFinalReceived(paymentAmount, bonusAmount);

  //   const invoiceData = {
  //     amount: paymentAmount,
  //     method: selectedMethod.variant,
  //     processingFee,
  //     bonusAmount,
  //     totalPayment,
  //     finalReceived,
  //     methodTitle: selectedMethod.title,
  //   };

  //   console.log("createInvoice data:", invoiceData);
  //   // Здесь будет: createInvoice(invoiceData);
  // };
  // Обработчик покупки
  const handlePurchase = async () => {
    if (!selectedMethod || paymentAmount <= 0 || isProcessing) return;

    setIsProcessing(true); // Включаем загрузку кнопки

    try {
      const result = await createInvoice({
        amount: paymentAmount,
        payment_method: selectedMethod.variant,
        currency: "USD",
      });

      console.log("Invoice created:", result);

      if (result.payment_url) {
        router.push(result.payment_url);
      }
      setTimeout(() => {
        setIsProcessing(false);
      }, 1500);
      // onOpenChange(false);
    } catch (error) {
      console.error("Failed to create invoice:", error);
      toast.error("Failed to create invoice");
      setIsProcessing(false);
    }
  };
  return (
    <>
      <Modal
        open={open}
        size="lg"
        titleClassName="p-0 pr-4 items-start pt-4"
        title={
          <div className="flex w-full items-center gap-3 px-6 pb-4">
            <CustomIcon.Swap size={32} />
            <div>
              <p className="text-foreground text-lg font-bold">
                Add funds to trade balance
              </p>
              <p className="text-muted text-sm font-medium">
                Available funds: {formatPrice(balance?.balance || 0)}
              </p>
            </div>
          </div>
        }
        onOpenChange={handleModalClose}
        trigger={
          <button
            style={{
              display: "none",
            }}
          />
        }
        contentClassName="p-0"
      >
        <>
          <AnimatePresence mode="wait">
            {selectedMethod ? (
              <motion.div
                key="selected-method"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                <SelectedMethodView
                  method={selectedMethod}
                  onBack={handleBackToMethods}
                  paymentAmount={paymentAmount}
                  customAmount={customAmount}
                  activeAmountButton={activeAmountButton}
                  onCustomAmountChange={handleCustomAmountChange}
                  onPredefinedAmountClick={handlePredefinedAmountClick}
                />
              </motion.div>
            ) : (
              <motion.div
                key="method-selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="h-[490px] border-t border-[#252632] px-6 pt-8"
              >
                <p className="text-muted mb-2 text-sm font-bold uppercase">
                  SELECT PAYMENT METHOD
                </p>
                <div className="grid max-h-[310px] grid-cols-2 gap-2 overflow-y-auto">
                  {paymentMethods.map((method) => (
                    <TopUpItem
                      key={method.variant}
                      variant={method.variant}
                      extraBonus={method.extraBonus}
                      onClick={() => handlePaymentMethodClick(method.variant)}
                    />
                  ))}
                </div>
                <div className="relative mb-16 mt-8 aspect-[47/8]">
                  <Image src={"/images/popup-topup.webp"} fill alt="banner" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center border-t border-[#252632] px-6 py-4">
            <p className="text-muted text-sm font-semibold">
              By clicking Confirm purchase, you agree to our{" "}
              <Link href={"https://tradeit.gg/tos"} className="text-[#615dfc]">
                Terms of Service
              </Link>{" "}
              and that you have read our{" "}
              <Link
                href={"https://tradeit.gg/privacy"}
                className="text-[#615dfc]"
              >
                {" "}
                Privacy Policy
              </Link>
            </p>
            <Button
              loading={isProcessing || isCreatingInvoice}
              className={cn(
                "ml-auto h-fit shrink-0",
                selectedMethod &&
                  paymentAmount > 0 &&
                  paymentAmount >= selectedMethod.minAmount
                  ? "opacity-100"
                  : "opacity-15",
              )}
              onClick={handlePurchase}
              disabled={
                !selectedMethod ||
                paymentAmount <= 0 ||
                paymentAmount < (selectedMethod?.minAmount || 0) ||
                isCreatingInvoice ||
                isProcessing
              }
            >
              <CustomIcon.Awesome name="lock" type="fas" className="scale-85" />
              Complete Purchase
            </Button>
          </div>
        </>
      </Modal>
    </>
  );
}
