﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using Kooboo.Data.Language;

namespace Kooboo.Model.Meta.Validation
{
    public class IpAddressRule:ValidationRule
    {
        public IpAddressRule(string message="")
        {
            Message = message;
        }

        private string _message;
        public override string Message
        {
            get
            {
                _message = string.IsNullOrEmpty(_message)
                 ? Hardcoded.GetValue("invalid ip address", Context)
                 : Hardcoded.GetValue(_message, Context);

                return _message;
            }
            set
            {
                _message = value;
            }
        }

        public override string GetRule()
        {
            return string.Format("{{type:\"ipAddress\",message:\"{0}\"}}", Message);
        }

        public override bool IsValid(object value)
        {
            if (base.IsValid(value))
            {
                return true;
            }

            var parts = value.ToString().Split('.');
            //all ipv4
            if (parts.Length != 4)
            {
                return false;
            }

            IPAddress address;
            return IPAddress.TryParse(value.ToString(), out address);

            //byte bit;
            //return parts.All(p => byte.TryParse(p, out bit));
        }
    }
}
