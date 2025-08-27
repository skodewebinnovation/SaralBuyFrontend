'use client'

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
import RecentProductCard from '@/Components/RecentProductCard'
import InfiniteScroll from "react-infinite-scroll-component";
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
  const { data, loading, error } = useCategoriesStore();
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
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-gray-600">Product Cartegory</h1>

            <div className="flex items-center">

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-4 gap-y-10 lg:grid-cols-4">
              {/* Category */}
              <form className="hidden lg:block shadow-sm rounded-2xl p-6 border bg-orange-100/50 sticky top-4  self-start">
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

              {/* Product grid */}
              <div className="lg:col-span-3 shadow-sm rounded-2xl p-6 border  ">
                <div className='grid grid-col-1 sm:grid-cols-2 gap-6 '>
                  {
                    [1, 2, 4, 3, 4, 5, 6, 8, 5, 6, 8, 9].map(i => <RecentProductCard />)
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
