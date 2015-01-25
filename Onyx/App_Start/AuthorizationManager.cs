using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Thinktecture.IdentityModel.Owin.ResourceAuthorization;

namespace Onyx
{
    public class AuthorizationManager : ResourceAuthorizationManager
    {
        
        public override Task<bool> CheckAccessAsync(ResourceAuthorizationContext context)
        {
            return CheckAccess(context);
        }

        public  Task<bool> CheckAccess(ResourceAuthorizationContext context)
        {
            if (!context.Principal.Identity.IsAuthenticated)
            {
                return Nok();
            }

            var resource = context.Resource.First().Value;
            var claims = context.Principal.Claims.ToList();

            switch (resource)
            {
                case "ResourceOne": return Check(context);
                default: return Nok();// throw new NotSupportedException(string.Format("{0} is not a valid resource", resource));
            }
        }

        private Task<bool> Check(ResourceAuthorizationContext context)
        {
            var action = context.Action.First().Value;

            switch (action)
            {
                case "ActionOne": return Eval(context.Principal.HasClaim("access", "Administrator"));
                case "ActionTwo": return Eval(context.Principal.HasClaim("access", "Administrator"));
                default: return Nok();// throw new NotSupportedException(string.Format("{0} is not a valid action", action));
            }
        }
    }



}