﻿using System;
using System.Collections.Generic;
using System.Text;
using Kooboo.Data.Context;
using Kooboo.Data.Interface;
using Kooboo.Sites.Extensions;

namespace Kooboo.Sites.Scripting.Global.Database
{
    public abstract class Database
    {
        protected RenderContext context;

        protected virtual string Name => "indexdb";
        public string connectionString;
        public Database(RenderContext context)
        {
            this.context = context;
        }

        protected T GetSetting<T>(RenderContext context) where T : ISiteSetting
        {
            return context.WebSite.SiteDb().CoreSetting.GetSetting<T>();
        }

        public abstract IkTable GetTable(string name);

        public IkTable Table(string name)
        {
            return GetTable(name);
        }

        public IkTable this[string key]
        {
            get
            {
                return GetTable(key);
            }
        }

    }
}