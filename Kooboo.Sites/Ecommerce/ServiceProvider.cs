﻿using Kooboo.Data.Context;
using Kooboo.Sites.Ecommerce.Service;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kooboo.Sites.Ecommerce
{
    public static class ServiceProvider
    {
        public static T GetService<T>(RenderContext Context) where T : IEcommerceService
        {
            var obj = Lib.IOC.Service.CreateInstanceByPriority<T>() as IEcommerceService;
            obj.Context = Context;
            obj.CommerceContext = GetCommerceContext(Context);
            return (T)obj;
        }

        private static object _locker = new object();

        public static CommerceContext GetCommerceContext(RenderContext context)
        {
            if (!context.HasItem<CommerceContext>())
            {
                lock (_locker)
                {
                    if (!context.HasItem<CommerceContext>())
                    {
                        CommerceContext commerceContext = new CommerceContext(context);
                        context.SetItem<CommerceContext>(commerceContext);
                    }
                }
            }
            return context.GetItem<CommerceContext>();
        }

        public static CategoryService Category(RenderContext context)
        {
            return GetService<CategoryService>(context);
        }

        public static ProductService Product(RenderContext context)
        {
            return GetService<ProductService>(context);
        }

        public static ProductVariantsService ProductVariants(RenderContext context)
        {
            return GetService<ProductVariantsService>(context);
        }

        public static ICustomerService Customer(RenderContext context)
        {
            return GetService<ICustomerService>(context);
        }

        public static ProductCategoryService ProductCategory(RenderContext context)
        {
            return GetService<ProductCategoryService>(context);
        }

        public static ProductTypeService ProductType(RenderContext context)
        {
            return GetService<ProductTypeService>(context);
        }

        public static ICartService Cart(RenderContext context)
        {
            return GetService<ICartService>(context);
        }

        public static ShippingService Shipping(RenderContext context)
        {
            return GetService<ShippingService>(context);
        }

        public static GeoCountryService GeoCountry(RenderContext context)
        {
            return GetService<GeoCountryService>(context);
        }
    }
}
