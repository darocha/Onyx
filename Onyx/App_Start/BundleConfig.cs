using System.Web;
using System.Web.Optimization;

namespace Onyx
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            // bundles.Add(new ScriptBundle("~/bundles/endlessscroll").Include("~/scripts/endlessscroll.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js",
                      "~/Scripts/iscroll5/build/iscroll.js",
                      "~/Scripts/greensock-js/src/minified/TweenMax.min.js",
                      "~/Scripts/greensock-js/src/minified/plugins/CssPlugin.min.js",
                      "~/Scripts/greensock-js/src/minified/plugins/CssRulePlugin.min.js",
                      "~/Scripts/greensock-js/src/minified/plugins/DirectionalRotationPlugin.min.js",
                      //"~/Scripts/jquery.validate.min.js",
                      //"~/Scripts/history/history.js",
                      //"~/Scripts/history/history.adapter.jquery.js",
                      //"~/Scripts/json2.js",
                      //"~/scripts/moment.js", 
                      //"~/scripts/moment-datepicker.js",
                      "~/Scripts/jquery.maskedinput.min.js",
                      "~/Scripts/autonumeric.js",
                      //"~/Scripts/jquery.simplyCountable.js",
                      "~/Scripts/rateit/src/jquery.rateit.min.js",

                      //"~/scripts/endlessscroll.js",
                      "~/scripts/jquery.prettydate.js",
                      "~/Scripts/jquery.cookie.js"
                      ));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/content/datepicker.css",
                      "~/Scripts/rateit/src/rateit.css",
                      "~/Content/site.css"));

            // Set EnableOptimizations to false for debugging
            BundleTable.EnableOptimizations = false;
        }
    }
}
