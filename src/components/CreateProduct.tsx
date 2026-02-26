import { useCreateProductMutation } from "@/api/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { productSchema } from "@/types/productSchema";
import type { ProductFormValues } from "@/types/productSchema";

const CreateProduct = () => {
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ProductFormValues) => {
    await createProduct({
      id: data.name.toLowerCase().replace(/\s/g, "-"),
      name: data.name,
    }).unwrap();
    form.reset();
  };
  return (
    <div className="p-4 border rounded-md bg-card border-var h-[200px]">
      <h3 className="mb-4 text-lg font-semibold">Create Product</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label>Name *</Label>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            disabled={!form.formState.isValid || isLoading}
            className="w-full btn-var"
          >
            {isLoading ? "Creating..." : "Create Product"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateProduct;
