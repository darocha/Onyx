using Microsoft.Owin;
using Owin;
using System.Collections.Generic;
using System.IdentityModel.Tokens;

[assembly: OwinStartupAttribute(typeof(Onyx.Startup))]
namespace Onyx
{
    public partial class Startup
    {
         
        public void Configuration(IAppBuilder app)
        {
            
            ConfigureAuth(app);
        }
    }
}
