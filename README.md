# 💰 Smart Budget Planner

A modern, intuitive expense tracking and savings visualization application built with React. Take control of your finances with beautiful charts, smart insights, and goal tracking features.

![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-19.1.0-blue.svg)
![Vite](https://img.shields.io/badge/Vite-6.3.5-purple.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.7-cyan.svg)

## ✨ Features

### 📊 **Dashboard Overview**
- **Real-time Financial Summary**: Track total income, expenses, and savings at a glance
- **Interactive Charts**: Visualize spending patterns with pie charts and savings trends with line charts
- **Smart Insights**: AI-powered recommendations for better financial management
- **Budget Alerts**: Get notified when you're approaching spending limits

### 💵 **Income & Expense Management**
- **Easy Transaction Entry**: Quick forms to add income and expenses
- **Category Organization**: Pre-defined categories with custom icons and colors
- **Date Range Filtering**: View data for specific time periods
- **Monthly Growth Tracking**: Monitor income trends month-over-month

### 📈 **Analytics & Reports**
- **Detailed Reports**: Comprehensive analysis of your financial data
- **Category Breakdown**: See where your money goes with visual breakdowns
- **Savings Trends**: Track your savings progress over time
- **Goal Progress**: Set and monitor financial goals

### 🎯 **Goal Tracking**
- **Financial Goals**: Set savings targets and track progress
- **Visual Progress Indicators**: Beautiful progress bars and charts
- **Achievement Notifications**: Celebrate when you reach your goals

### 🎨 **Modern UI/UX**
- **Dark Theme**: Sleek black and green gradient design
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Engaging micro-interactions and transitions
- **Accessibility**: Built with accessibility best practices

## 🚀 Quick Start

### Prerequisites

Make sure you have Node.js (version 16 or higher) installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd smart-budget-planner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

## 🛠️ Technology Stack

### **Frontend Framework**
- **React 19.1.0** - Latest React with concurrent features
- **Vite 6.3.5** - Fast build tool and development server

### **UI Components & Styling**
- **Tailwind CSS 4.1.7** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components
- **shadcn/ui** - Beautiful, reusable components built on Radix UI
- **Lucide React** - Beautiful & consistent icon library
- **Framer Motion** - Production-ready motion library

### **Form Handling & Validation**
- **React Hook Form 7.56.3** - Performant forms with easy validation
- **Zod 3.24.4** - TypeScript-first schema validation

### **Data Visualization**
- **Recharts 2.15.3** - Composable charting library for React
- **D3.js** (via Recharts) - Powerful data visualization

### **Additional Libraries**
- **date-fns 3.6.0** - Modern JavaScript date utility library
- **React Router DOM 7.6.1** - Declarative routing for React
- **Embla Carousel** - Flexible carousel component
- **Sonner** - Elegant toast notifications

## 📁 Project Structure

```
smart-budget-planner/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Reusable UI components
│   │   ├── cards/         # Dashboard summary cards
│   │   ├── charts/        # Data visualization components
│   │   ├── forms/         # Form components
│   │   ├── insights/      # Smart insights components
│   │   └── ui/            # shadcn/ui components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── pages/             # Main application pages
│   │   ├── Dashboard.jsx  # Main dashboard
│   │   ├── AddIncome.jsx  # Income entry page
│   │   ├── AddExpense.jsx # Expense entry page
│   │   └── Reports.jsx    # Analytics and reports
│   ├── utils/             # Utility functions
│   │   └── storage.js     # LocalStorage management
│   ├── App.jsx            # Main application component
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles
├── package.json           # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── components.json       # shadcn/ui configuration
└── README.md             # This file
```

## 🔧 Available Scripts

- **`npm run dev`** - Start development server
- **`npm run build`** - Build for production
- **`npm run preview`** - Preview production build
- **`npm run lint`** - Run ESLint for code quality

## 💾 Data Storage

The application uses **localStorage** to persist your financial data locally in your browser. This means:

- ✅ Your data stays private and secure on your device
- ✅ No internet connection required
- ✅ Fast performance with instant data access
- ⚠️ Data is tied to your browser (clearing browser data will remove your information)

### Data Structure

The app stores the following types of data:
- **Transactions**: Income and expense records with categories, amounts, and dates
- **Categories**: Customizable categories for organizing transactions
- **Goals**: Financial targets and savings goals
- **Settings**: User preferences and configuration

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) components, which provide:

- **Accessibility-first**: Built on Radix UI primitives
- **Customizable**: Fully customizable with Tailwind CSS
- **Type-safe**: Written in TypeScript (adaptable to JavaScript)
- **Dark mode ready**: Supports theme switching

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop**: Full-featured dashboard with sidebar navigation
- **Tablet**: Optimized layout with collapsible sidebar
- **Mobile**: Touch-friendly interface with drawer navigation

## 🌟 Key Features Deep Dive

### Dashboard
- Real-time financial overview with animated cards
- Interactive charts showing spending patterns and savings trends
- Quick action buttons for common tasks
- Smart insights based on your spending habits

### Transaction Management
- Simple forms for adding income and expenses
- Category-based organization with visual icons
- Date selection with calendar picker
- Form validation and error handling

### Analytics & Reports
- Monthly spending breakdowns
- Category-wise expense analysis
- Savings trend visualization
- Comparative reports across different time periods

### Goal Tracking
- Set custom savings goals
- Visual progress tracking
- Achievement notifications
- Goal completion celebrations

## 🔮 Future Enhancements

- [ ] **Export functionality** - Export data to CSV/PDF
- [ ] **Cloud sync** - Backup data to cloud storage
- [ ] **Budget planning** - Set monthly budgets by category
- [ ] **Recurring transactions** - Automate regular income/expenses
- [ ] **Multi-currency support** - Support for different currencies
- [ ] **Data visualization** - More chart types and analytics
- [ ] **Mobile app** - React Native version
- [ ] **AI insights** - Advanced financial advice using ML

## 🤝 Contributing

This is a personal learning project created during the INSA Summer Camp. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **INSA Summer Camp** - Backend Development Program
- **shadcn/ui** - Beautiful UI component library
- **Radix UI** - Accessible component primitives
- **Recharts** - Awesome charting library for React
- **Lucide** - Beautiful icon library

## 📞 Support

If you have any questions or need help with the project:

1. Check the existing issues
2. Create a new issue with detailed description
3. Provide steps to reproduce any bugs

---

**Made with ❤️ during INSA Summer Camp 2025**

*Transform your financial future, one transaction at a time!* 🚀
