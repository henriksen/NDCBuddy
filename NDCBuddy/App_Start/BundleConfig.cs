using System.Web;
using System.Web.Optimization;

namespace NDCBuddy
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-1.9.*"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryplugins").Include(
                        "~/Scripts/jquery.timeago.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Scripts/jquery-ui*"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.unobtrusive*",
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                                    "~/Scripts/angular.js",
                                    "~/Scripts/angular-keypress.js"));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                        "~/app/*.js"));

            bundles.Add(new ScriptBundle("~/bundles/underscore").Include(
            "~/Scripts/underscore.js"));

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //// use this BundleConfig OR add the 3 lines below to your existing BundleConfig.cs and delete this file.
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
            var css = new StyleBundle("~/Content/css").Include("~/Content/site.less");
            css.Transforms.Add(new LessMinify());
            bundles.Add(css);

            bundles.Add(new StyleBundle("~/Content/fontAwesome").Include(
                "~/Content/font-awesome.css"));

            bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
                        "~/Content/themes/base/jquery.ui.core.css",
                        "~/Content/themes/base/jquery.ui.resizable.css",
                        "~/Content/themes/base/jquery.ui.selectable.css",
                        "~/Content/themes/base/jquery.ui.accordion.css",
                        "~/Content/themes/base/jquery.ui.autocomplete.css",
                        "~/Content/themes/base/jquery.ui.button.css",
                        "~/Content/themes/base/jquery.ui.dialog.css",
                        "~/Content/themes/base/jquery.ui.slider.css",
                        "~/Content/themes/base/jquery.ui.tabs.css",
                        "~/Content/themes/base/jquery.ui.datepicker.css",
                        "~/Content/themes/base/jquery.ui.progressbar.css",
                        "~/Content/themes/base/jquery.ui.theme.css"));
        }
    }
}