import React from "react";

// Lazy-loaded components
const UpdateTreatment = React.lazy(
  () => import("./components/updateTreatment"),
);
const UpdateQuestion = React.lazy(
  () => import("./components/UpdateQuestions/update_question1"),
);

const QuestionDetails = React.lazy("./components/questionDetails");

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const Colors = React.lazy(() => import("./views/theme/colors/Colors"));
const Typography = React.lazy(
  () => import("./views/theme/typography/Typography"),
);
const AddPatient = React.lazy(() => import("./components/addpatient"));
const QuestionList = React.lazy(() => import("./components/questionsList"));
const AddQuestions = React.lazy(() => import("./components/addQuestions"));
const ViewQuestions = React.lazy(() => import("./components/viewQuestions"));
const Questionpaper = React.lazy(() => import("./components/questionpaper"));
const Doctor = React.lazy(() => import("./components/doctor"));
const AddDoctor = React.lazy(() => import("./components/addDoctor"));
const AddTreatment = React.lazy(() => import("./components/addTreatment"));
const Treatment = React.lazy(() => import("./components/treatment"));
const AddServices = React.lazy(() => import("./components/addServices"));
const Services = React.lazy(() => import("./components/services"));
const Medicine = React.lazy(() => import("./components/medicineMaster"));
const AddCategoryMaster = React.lazy(
  () => import("./components/addCategoryMaster"),
);
const CategoryMaster = React.lazy(() => import("./components/categoryMaster"));
const Addmedicinemaster = React.lazy(
  () => import("./components/addmedicinemaster"),
);

// Base components
const Accordion = React.lazy(() => import("./views/base/accordion/Accordion"));
const Breadcrumbs = React.lazy(
  () => import("./views/base/breadcrumbs/Breadcrumbs"),
);
const Cards = React.lazy(() => import("./views/base/cards/Cards"));
const Collapses = React.lazy(() => import("./views/base/collapses/Collapses"));
const ListGroups = React.lazy(
  () => import("./views/base/list-groups/ListGroups"),
);
const Navs = React.lazy(() => import("./views/base/navs/Navs"));
const Paginations = React.lazy(
  () => import("./views/base/paginations/Paginations"),
);
const Placeholders = React.lazy(
  () => import("./views/base/placeholders/Placeholders"),
);
const Popovers = React.lazy(() => import("./views/base/popovers/Popovers"));
const Progress = React.lazy(() => import("./views/base/progress/Progress"));
const Spinners = React.lazy(() => import("./views/base/spinners/Spinners"));
const Tables = React.lazy(() => import("./views/base/tables/Tables"));
const Tooltips = React.lazy(() => import("./views/base/tooltips/Tooltips"));

// Buttons components
const Buttons = React.lazy(() => import("./views/buttons/buttons/Buttons"));
const ButtonGroups = React.lazy(
  () => import("./views/buttons/button-groups/ButtonGroups"),
);
const Dropdowns = React.lazy(
  () => import("./views/buttons/dropdowns/Dropdowns"),
);

// Forms components
const ChecksRadios = React.lazy(
  () => import("./views/forms/checks-radios/ChecksRadios"),
);
const FloatingLabels = React.lazy(
  () => import("./views/forms/floating-labels/FloatingLabels"),
);
const FormControl = React.lazy(
  () => import("./views/forms/form-control/FormControl"),
);
const InputGroup = React.lazy(
  () => import("./views/forms/input-group/InputGroup"),
);
const Layout = React.lazy(() => import("./views/forms/layout/Layout"));
const Range = React.lazy(() => import("./views/forms/range/Range"));
const Select = React.lazy(() => import("./views/forms/select/Select"));
const Validation = React.lazy(
  () => import("./views/forms/validation/Validation"),
);

// Charts
const Charts = React.lazy(() => import("./views/charts/Charts"));

// Icons components
const CoreUIIcons = React.lazy(
  () => import("./views/icons/coreui-icons/CoreUIIcons"),
);
const Flags = React.lazy(() => import("./views/icons/flags/Flags"));
const Brands = React.lazy(() => import("./views/icons/brands/Brands"));

// Notifications components
const Alerts = React.lazy(() => import("./views/notifications/alerts/Alerts"));
const Badges = React.lazy(() => import("./views/notifications/badges/Badges"));
const Modals = React.lazy(() => import("./views/notifications/modals/Modals"));
const Toasts = React.lazy(() => import("./views/notifications/toasts/Toasts"));

// Widgets
const Widgets = React.lazy(() => import("./views/widgets/Widgets"));

// Routes configuration
const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", element: Dashboard },
  { path: "/theme", name: "Theme", element: Colors, exact: true },
  { path: "/addpatient", name: "Add Patient", element: AddPatient },
  { path: "/questionsList", name: "questionsList", element: QuestionList },
  {
    path: "/update_question1/:id",
    name: "Update Question",
    element: UpdateQuestion,
  },
  { path: "/addQuestions", name: "Add Question", element: AddQuestions },
  { path: "/viewQuestions", name: "View Question", element: ViewQuestions },

  {
    path: "/questionDetails/:id",
    name: "Question Details",
    element: QuestionDetails,
  },

  { path: "/questionpaper", name: "Question Paper", element: Questionpaper },
  { path: "/doctor", name: "Doctor", element: Doctor },
  { path: "/addDoctor", name: "Add Doctor", element: AddDoctor },
  { path: "/addtreatment", name: "Add Treatment", element: AddTreatment },
  {
    path: "/updateTreatment",
    name: "Update Treatment",
    element: UpdateTreatment,
  },
  { path: "/treatment", name: "Treatment", element: Treatment },
  { path: "/addServices", name: "Add Services", element: AddServices },
  { path: "/services", name: "Services", element: Services },
  { path: "/medicineMaster", name: "Medicine Master", element: Medicine },
  {
    path: "/addCategoryMaster",
    name: "Add Category Master",
    element: AddCategoryMaster,
  },
  { path: "/categoryMaster", name: "Category Master", element: CategoryMaster },
  {
    path: "/addmedicinemaster",
    name: "Add Medicine Master",
    element: Addmedicinemaster,
  },
  { path: "/theme/colors", name: "Colors", element: Colors },
  { path: "/theme/typography", name: "Typography", element: Typography },
  { path: "/base", name: "Base", element: Cards, exact: true },
  { path: "/base/accordion", name: "Accordion", element: Accordion },
  { path: "/base/breadcrumbs", name: "Breadcrumbs", element: Breadcrumbs },
  { path: "/base/cards", name: "Cards", element: Cards },
  { path: "/base/collapses", name: "Collapses", element: Collapses },
  { path: "/base/list-groups", name: "List Groups", element: ListGroups },
  { path: "/base/navs", name: "Navs", element: Navs },
  { path: "/base/paginations", name: "Paginations", element: Paginations },
  { path: "/base/placeholders", name: "Placeholders", element: Placeholders },
  { path: "/base/popovers", name: "Popovers", element: Popovers },
  { path: "/base/progress", name: "Progress", element: Progress },
  { path: "/base/spinners", name: "Spinners", element: Spinners },
  { path: "/base/tables", name: "Tables", element: Tables },
  { path: "/base/tooltips", name: "Tooltips", element: Tooltips },
  { path: "/buttons", name: "Buttons", element: Buttons, exact: true },
  { path: "/buttons/buttons", name: "Buttons", element: Buttons },
  { path: "/buttons/dropdowns", name: "Dropdowns", element: Dropdowns },
  {
    path: "/buttons/button-groups",
    name: "Button Groups",
    element: ButtonGroups,
  },
  { path: "/charts", name: "Charts", element: Charts },
  { path: "/forms", name: "Forms", element: FormControl, exact: true },
  { path: "/forms/form-control", name: "Form Control", element: FormControl },
  { path: "/forms/select", name: "Select", element: Select },
  {
    path: "/forms/checks-radios",
    name: "Checks & Radios",
    element: ChecksRadios,
  },
  { path: "/forms/range", name: "Range", element: Range },
  { path: "/forms/input-group", name: "Input Group", element: InputGroup },
  {
    path: "/forms/floating-labels",
    name: "Floating Labels",
    element: FloatingLabels,
  },
  { path: "/forms/layout", name: "Layout", element: Layout },
  { path: "/forms/validation", name: "Validation", element: Validation },
  { path: "/icons", exact: true, name: "Icons", element: CoreUIIcons },
  { path: "/icons/coreui-icons", name: "CoreUI Icons", element: CoreUIIcons },
  { path: "/icons/flags", name: "Flags", element: Flags },
  { path: "/icons/brands", name: "Brands", element: Brands },
  {
    path: "/notifications",
    exact: true,
    name: "Notifications",
    element: Alerts,
  },
  { path: "/notifications/alerts", name: "Alerts", element: Alerts },
  { path: "/notifications/badges", name: "Badges", element: Badges },
  { path: "/notifications/modals", name: "Modals", element: Modals },
  { path: "/notifications/toasts", name: "Toasts", element: Toasts },
  { path: "/widgets", name: "Widgets", element: Widgets },
];

export default routes;
