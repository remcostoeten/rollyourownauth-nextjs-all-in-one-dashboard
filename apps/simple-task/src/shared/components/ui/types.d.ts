import { DetailedHTMLProps, HTMLAttributes, ButtonHTMLAttributes, LabelHTMLAttributes, InputHTMLAttributes } from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

declare module "@radix-ui/react-tabs" {
  interface TabsProps extends TabsPrimitive.TabsProps {
    className?: string
  }

  interface TabsListProps extends TabsPrimitive.TabsListProps {
    className?: string
  }

  interface TabsTriggerProps extends TabsPrimitive.TabsTriggerProps {
    className?: string
  }

  interface TabsContentProps extends TabsPrimitive.TabsContentProps {
    className?: string
  }
}

declare module "@radix-ui/react-radio-group" {
  interface RadioGroupProps extends RadioGroupPrimitive.RadioGroupProps {
    className?: string
  }

  interface RadioGroupItemProps extends RadioGroupPrimitive.RadioGroupItemProps {
    className?: string
  }

  interface RadioGroupIndicatorProps extends RadioGroupPrimitive.RadioGroupIndicatorProps {
    className?: string
  }
}

declare module "react" {
  interface HTMLAttributes<T> extends DetailedHTMLProps<HTMLAttributes<T>, T> {
    className?: string
  }

  interface ButtonHTMLAttributes<T> extends DetailedHTMLProps<ButtonHTMLAttributes<T>, T> {
    className?: string
  }

  interface LabelHTMLAttributes<T> extends DetailedHTMLProps<LabelHTMLAttributes<T>, T> {
    className?: string
  }

  interface InputHTMLAttributes<T> extends DetailedHTMLProps<InputHTMLAttributes<T>, T> {
    className?: string
  }
} 