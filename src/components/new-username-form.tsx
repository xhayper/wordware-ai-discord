'use client'

import { useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { PiSpinner } from 'react-icons/pi'
import { toast } from 'sonner'
import { z } from 'zod'

import { handleNewUsername } from '@/actions/actions'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cleanUsername } from '@/lib/utils'

/**
 * Zod schema for form validation
 */
const formSchema = z.object({
  username: z.undefined().nullable().optional(),
})

/**
 * NewUsernameForm component
 * Renders a form for entering a new username
 * @returns {JSX.Element}
 */
const NewUsernameForm = () => {
  const searchParams = useSearchParams()

  // Initialize form with react-hook-form and zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

  /**
   * Handle form submission
   * @param {z.infer<typeof formSchema>} values - Form values
   */
  async function onSubmit() {
    const response = await handleNewUsername({ username: 'Data Package' })
    console.log('🟣 | file: new-username-form.tsx:46 | onSubmit | response:', response)
    if (response?.error) {
      toast.error(`We're experiencing high traffic at the moment. Please try again in a few minutes. Thank you for your patience.`)
      console.log(response.error)
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                {/* Note: FormLabel is commented out, consider removing if not needed */}
                {/* <FormLabel>Your X handle or link</FormLabel> */}
                <FormControl>
                  <div className="flex items-center">
                    {/* <Input
                      disabled={form.formState.isSubmitting}
                      className="w-full rounded-l-sm rounded-r-none border-black"
                      placeholder="@username"
                      {...field}
                    /> */}
                    <Button
                      disabled={form.formState.isSubmitting}
                      type="submit"
                      className="rounded-r-sm">
                      Discover
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      {/* Display loading spinner when form is submitting or submission is successful */}
      {form.formState.isSubmitting && (
        <div className="flex items-center gap-2 text-sm">
          <PiSpinner className="animate-spin" />
          Looking for your Discord profile...
        </div>
      )}
    </div>
  )
}

export default NewUsernameForm
