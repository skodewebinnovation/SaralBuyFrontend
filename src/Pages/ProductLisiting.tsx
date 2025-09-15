import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { FunnelIcon, MinusIcon, PlusIcon } from '@heroicons/react/20/solid'
import { Label } from "../Components/ui/label"
import { RadioGroup, RadioGroupItem } from "../Components/ui/radio-group"
import { useCategoriesStore } from '@/zustand/getCategories'
import { Range } from "react-range";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from 'react-router-dom'
import { Spinner } from '../Components/ui/shadcn-io/spinner';
import productService from '@/services/product.service'
import ProductListingCard from '@/Components/ProductListingCard'
export default function ProductListing() {
  const [values, setValues] = useState([100, 4000]);
  const [filters, setFilters] = useState([
    {
      id: 'category',
      name: 'Category',
      options: [
        // DYNAMIC CATEGORIES
      ],
    },
    {
      id: 'budget',
      name: 'Budget',
      options: [
        { value: 'new-arrivals', label: 'New Arrivals', checked: false },
        { value: 'sale', label: 'Sale', checked: false },
        { value: 'travel', label: 'Travel', checked: true },
        { value: 'organization', label: 'Organization', checked: false },
        { value: 'accessories', label: 'Accessories', checked: false },
      ],
    },
    {
      id: 'sort',
      name: 'Sort',
      options: [
        { value: 'newly_added', label: 'Newly Added', checked: true },
        { value: 'feature', label: 'Feature', checked: false },
        { value: 'aplhabetically_a_z', label: 'Aplhabetically (A-Z)', checked: false },
        { value: 'aplhabetically_z_a', label: 'Aplhabetically (Z-A)', checked: false },
        { value: 'low_to_high', label: 'Price Low to High', checked: false },
        { value: 'high_to_low', label: 'price High to Low', checked: false },
      ],
    },
  ])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const { data } = useCategoriesStore();
  const [searchParams] = useSearchParams()

  const [title,setTitle] = useState('')
  const [key,setKey] = useState('')
  const [products, setProducts] = useState<any[]>([]);
  const [total,setTotal]= useState(0)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  useEffect(() => {
    if(!searchParams) return;
  setTitle(searchParams.get("title")!|| '')
  if(searchParams.get("key")) setKey(searchParams.get("key")!)
}, [searchParams]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    setFilters((prev) =>
      prev.map((section) => {
        if (section.id === "category") {
          return {
            ...section,
            options: data.map((cat: any) => ({
              value: cat._id,
              label: cat.categoryName,
              checked: false,
            })),
          };
        }
        return section;
      })
    );
  }, [data]);


useEffect(() => {
  if (title) {
    setProducts([]);
    setPage(1);
    fetchMoreData(true);
  }
}, [title]);

 const fetchMoreData  = async (reset:boolean= false) => {
  if (!title) return console.warn("title missing");
  const currentPage = reset ? 1 : page;

  try {
    const response = await productService.getProductByTitle(title, currentPage, limit);
    const newProducts  = response?.data?.data?.products || [];

    setProducts(prev => reset ? newProducts : [...prev, ...newProducts]);
    setTotal(response?.data?.data.total);
    const totalPages = response?.data?.data.totalPages;

    setHasMore(currentPage < totalPages);
    setPage(reset ? 2 : currentPage + 1);  // update consistently
  } catch (error) {
    console.log('Error during get products', error);
  }
};

  


  return (
    <div className="">
      <div>
        {/* Mobile filter dialog */}
        <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden bg-white">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex bg-white size-full max-w-xs transform flex-col overflow-y-auto  pt-4 pb-6 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Product Listing</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="relative -mr-2 flex size-10 items-center justify-center rounded-md  p-2 text-gray-400 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200 p-6">
                <h3 className="sr-only">Categories</h3>
                {filters.map((section) => (
                  section.id !== 'budget' ? <Disclosure key={section.id} as="div" className="border-b border-gray-200 py-6">
                    <h3 className="-my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between  py-2 text-sm text-gray-400 hover:text-gray-500">
                        <span className="font-semibold text-lg text-gray-600 tracking-wide" >{section.name}</span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                          <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-4">
                        <RadioGroup defaultValue={section.options[0]?.value}>
                          {section.options.map((option, optionIdx) => (
                            <div key={option.value} className="flex items-center gap-2">
                              <RadioGroupItem
                                value={option.value}
                                id={`filter-${section.id}-${optionIdx}`}
                              />
                              <Label htmlFor={`filter-${section.id}-${optionIdx}`} className="text-sm text-gray-600 capitalize tracking-wide">
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </DisclosurePanel>
                  </Disclosure> :
                    <Disclosure key={section.id} as="div" className="border-b border-gray-200 py-6">
                      <h3 className="-my-3 flow-root">
                        <DisclosureButton className="group flex w-full items-center justify-between  py-3 text-sm text-gray-400 hover:text-gray-500">
                          <span className="font-semibold text-lg text-gray-600">{section.name}</span>
                          <span className="ml-6 flex items-center">
                            <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                            <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                          </span>
                        </DisclosureButton>
                      </h3>
                      <DisclosurePanel className="pt-6">
                        <div className="w-full max-w-md border-[1.5px] border-gray-200 rounded-lg  p-3">
                          <div className="flex justify-between items-center mb-3">
                            {/* <Label className=" font-medium text-gray-500">Old Product</Label> */}
                         
                          </div>
                          <Range
                            values={values}
                            step={100}
                            min={100}
                            max={10000}
                            onChange={(vals) => setValues(vals)}
                            renderTrack={({ props, children }) => {
                              const min = 100;
                              const max = 10000;
                              const range = max - min;

                              const leftPercent = ((values[0] - min) / range) * 100;
                              const rightPercent = ((values[1] - min) / range) * 100;

                              return (
                                <div {...props} className="h-1 w-full bg-gray-300 rounded relative">
                                  <div
                                    className="absolute h-1 bg-orange-600 rounded"
                                    style={{
                                      left: `${leftPercent}%`,
                                      width: `${rightPercent - leftPercent}%`,
                                    }}
                                  />
                                  {children}
                                </div>
                              );
                            }}
                            renderThumb={({ props }) => (
                              <div
                                {...props}
                                className="w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center shadow"
                              />
                            )}
                          />

                          <div className="flex justify-between items-center mt-3 text-sm">
                            Price : {Number(values[0].toString().padStart(2, "0")).toLocaleString()} - {Number(values[1].toString().padStart(2, "0")).toLocaleString()}
                          </div>
                        </div>
                      </DisclosurePanel>
                    </Disclosure>


                ))}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        {/*  Desktop */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
          <div className="flex items-baseline justify-between  ">
                  {/* <Breadcrumb className="sm:block hidden">
          <BreadcrumbList >
            <BreadcrumbItem className="flex items-center gap-2 cursor-pointer" >
               <BreadcrumbPage className="capitalize font-semibold text-orange-600 ">
                {title}
              </BreadcrumbPage>
                <BreadcrumbSeparator />
                <BreadcrumbPage className="capitalize font-semibold text-gray-500">
                Reuirements {total || ""}
              </BreadcrumbPage>
            </BreadcrumbItem>

          </BreadcrumbList>
        </Breadcrumb> */}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="size-5" />
              </button>
           
          </div>

          <section aria-labelledby="products-heading" className="py-10">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-4 gap-y-10 lg:grid-cols-4">
              {/* Category */}
              <form className="hidden lg:block shadow-sm rounded-2xl p-6 border bg-orange-100/50 sticky top-4  self-start">
                <h3 className="sr-only">Categories</h3>


                {filters.map((section) => (
                  section.id !== 'budget' ? <Disclosure key={section.id} as="div" className="border-b border-gray-200 py-5">
                    <h3 className="-my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between  py-2 text-sm text-gray-400 hover:text-gray-500">
                        <span className="font-semibold text-[15px] text-gray-600 tracking-wide" >{section.name}</span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                          <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-4">
                        <RadioGroup defaultValue={section.options[0]?.value}>
                          {section.options.map((option, optionIdx) => (
                            <div key={option.value} className="flex items-center gap-2">
                              <RadioGroupItem
                                value={option.value}
                                id={`filter-${section.id}-${optionIdx}`}
                              />
                              <Label htmlFor={`filter-${section.id}-${optionIdx}`} className="text-sm text-gray-600 capitalize tracking-wide">
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </DisclosurePanel>
                  </Disclosure> :
                    <Disclosure key={section.id} as="div" className="border-b border-gray-200 py-3">
                      <h3 className="-my-3 flow-root">
                        <DisclosureButton className="group flex w-full items-center justify-between  py-3 text-sm text-gray-400 hover:text-gray-500">
                          <span className="font-semibold text-[15px] text-gray-600">{section.name}</span>
                          <span className="ml-6 flex items-center">
                            <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                            <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                          </span>
                        </DisclosureButton>
                      </h3>
                      <DisclosurePanel className="pt-6">
                        <div className="w-full max-w-md border-[1.5px] border-gray-200 rounded-lg  p-3">
                          <div className="flex justify-between items-center mb-3">
                            {/* <Label className=" font-medium text-gray-500">Old Product</Label> */}
                           
                          </div>
                          <Range
                            values={values}
                            step={100}
                            min={100}
                            max={10000}
                            onChange={(vals) => setValues(vals)}
                            renderTrack={({ props, children }) => {
                              const min = 100;
                              const max = 10000;
                              const range = max - min;

                              const leftPercent = ((values[0] - min) / range) * 100;
                              const rightPercent = ((values[1] - min) / range) * 100;

                              return (
                                <div {...props} className="h-1 w-full bg-gray-300 rounded relative">
                                  <div
                                    className="absolute h-1 bg-orange-600 rounded"
                                    style={{
                                      left: `${leftPercent}%`,
                                      width: `${rightPercent - leftPercent}%`,
                                    }}
                                  />
                                  {children}
                                </div>
                              );
                            }}
                            renderThumb={({ props }) => (
                              <div
                                {...props}
                                className="w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center shadow"
                              />
                            )}
                          />

                          <div className="flex justify-between items-center mt-3 text-sm">
                            Price : {Number(values[0].toString().padStart(2, "0")).toLocaleString()} - {Number(values[1].toString().padStart(2, "0")).toLocaleString()}
                          </div>
                        </div>
                      </DisclosurePanel>
                    </Disclosure>


                ))}
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3   ">
               <div className="flex justify-between items-center mb-4">
        <p className="font-bold text-2xl border-l-4 border-gray-800 pl-3 tracking-tight text-gray-800">
          Results
        </p>
        <p className="text-sm text-gray-600 font-medium">
        {total || 0}  Requirements 
        </p>
      </div>
                 <div className='shadow-sm rounded-2xl p-6 border'>
                  {
                  key.length > 0 && products.length == 0 ?
                  <div className='flex justify-center items-center h-full flex-col space-y-2'>
                    <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-illustration-svg-png-download-8779492.png" alt="" className='h-24 w-24' />
                    <p className='text-xl font-semibold  text-center'>No Item Found</p>
                  </div>:
                   <InfiniteScroll
                  dataLength={products.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  loader={  <div className="flex justify-center py-6">
                  <Spinner className="h-6 w-6 animate-spin text-orange-500" />
                </div>}
                  endMessage={<p className="text-center pt-4 text-gray-400">You have seen all products.</p>}
               
                >
                <div className="grid grid-col-1 sm:grid-cols-2 gap-6">
                  {products.map((product: any) => <ProductListingCard  product={product}/>)}
                </div>
                </InfiniteScroll>
                 }
                 </div>
           
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
