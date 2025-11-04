import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import DarkVeil from "@/components/ui/DarkVeil";
import {
  OracleIcon,
  SAPIcon,
  NetSuiteIcon,
  DynamicsIcon,
  SalesforceIcon,
  HubSpotIcon,
  ZohoIcon,
  PipedriveIcon,
  ZendeskIcon,
  ServiceNowIcon,
  FreshdeskIcon,
  JiraIcon,
  GoogleWorkspaceIcon,
  OutlookIcon,
  TeamsIcon,
  SlackIcon,
  CalendlyIcon,
  GoogleCalendarIcon,
  OutlookCalendarIcon,
  ShopifyIcon,
  MagentoIcon,
  WooCommerceIcon,
  BigCommerceIcon,
} from "@/components/integrations/IntegrationIcons";

export default function LandingPage() {
  const [loadingStage, setLoadingStage] = useState(0);
  const [showMainContent, setShowMainContent] = useState(false);

  useEffect(() => {
    // Exact timing sequence from the original website
    const timers = [
      setTimeout(() => setLoadingStage(1), 800), // Ring appears
      setTimeout(() => setLoadingStage(2), 2200), // "AI" appears
      setTimeout(() => setLoadingStage(3), 2800), // "Calling" appears
      setTimeout(() => setLoadingStage(4), 3400), // "Assistant" appears
      setTimeout(() => setLoadingStage(5), 4500), // Text fades
      setTimeout(() => setShowMainContent(true), 5200), // Main content
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      <AnimatePresence mode="wait">
        {!showMainContent && (
          <LoadingSequence key="loading" stage={loadingStage} />
        )}
        {showMainContent && <MainContent key="main" />}
      </AnimatePresence>
    </div>
  );
}

function LoadingSequence({ stage }: { stage: number }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 3D Ring Animation */}
      <div className="relative">
        {/* Outer glow layers */}
        <motion.div
          className="absolute inset-0"
          style={{
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, rgba(249, 115, 22, 0.08) 30%, transparent 60%)",
            filter: "blur(40px)",
            transform: "translate(-50%, -50%)",
            left: "50%",
            top: "50%",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={
            stage >= 1
              ? {
                  scale: [0, 1.2, 1],
                  opacity: [0, 0.6, 0.3],
                }
              : {}
          }
          transition={{
            duration: 1.5,
            ease: "easeOut",
          }}
        />

        <motion.div
          className="absolute inset-0"
          style={{
            width: "350px",
            height: "350px",
            background:
              "radial-gradient(circle, rgba(251, 146, 60, 0.25) 0%, rgba(251, 146, 60, 0.12) 40%, transparent 70%)",
            filter: "blur(25px)",
            transform: "translate(-50%, -50%)",
            left: "50%",
            top: "50%",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={
            stage >= 1
              ? {
                  scale: [0, 1.1, 1],
                  opacity: [0, 0.7, 0.4],
                }
              : {}
          }
          transition={{
            duration: 1.2,
            delay: 0.2,
            ease: "easeOut",
          }}
        />

        {/* Main Ring Container */}
        <motion.div
          className="relative"
          style={{
            width: "280px",
            height: "280px",
            perspective: "1000px",
          }}
          initial={{ scale: 0, rotateX: 0, rotateY: 0, opacity: 0 }}
          animate={
            stage >= 1
              ? {
                  scale: 1,
                  opacity: 1,
                  rotateX: [0, 15, -15, 0],
                  rotateY: [0, 360],
                }
              : {}
          }
          transition={{
            scale: { duration: 1, ease: "easeOut" },
            opacity: { duration: 0.8 },
            rotateX: {
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            },
            rotateY: {
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              delay: 1,
            },
          }}
        >
          {/* Main Ring Structure */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "32px solid transparent",
              borderImage:
                "linear-gradient(45deg, rgba(249, 115, 22, 0.9), rgba(251, 146, 60, 0.7), rgba(254, 215, 170, 0.5)) 1",
              background: "transparent",
              boxShadow: `
                inset 0 0 60px rgba(249, 115, 22, 0.5),
                0 0 80px rgba(249, 115, 22, 0.4),
                0 0 120px rgba(249, 115, 22, 0.3),
                0 0 160px rgba(249, 115, 22, 0.2)
              `,
              filter: "blur(0.5px)",
            }}
          />

          {/* Rotating Light Streak */}
          <motion.div
            className="absolute top-0 left-1/2 w-1 h-8 bg-gradient-to-b from-orange-200 via-orange-400 to-transparent rounded-full"
            style={{
              transformOrigin: "center 140px",
              filter: "blur(0.5px)",
              boxShadow: "0 0 10px rgba(254, 215, 170, 0.8)",
            }}
            animate={
              stage >= 1
                ? {
                    rotate: [0, 360],
                    opacity: [0.6, 1, 0.6],
                  }
                : {}
            }
            transition={{
              rotate: {
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                delay: 1.5,
              },
              opacity: {
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 1.5,
              },
            }}
          />
        </motion.div>

        {/* Central Core Glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "60px",
            height: "60px",
            background:
              "radial-gradient(circle, rgba(254, 215, 170, 0.9) 0%, rgba(249, 115, 22, 0.5) 40%, transparent 80%)",
            borderRadius: "50%",
            filter: "blur(8px)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={
            stage >= 1
              ? {
                  scale: [0, 1.1, 0.8, 1],
                  opacity: [0, 0.9, 0.6, 0.8],
                }
              : {}
          }
          transition={{
            duration: 1.5,
            delay: 0.5,
            ease: "easeOut",
          }}
        />
      </div>

      {/* Text Animations */}
      <AnimatePresence>
        {stage >= 2 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              {/* "AI" Text */}
              <motion.div
                className="text-7xl md:text-9xl font-medium text-white mb-4"
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={
                  stage >= 2
                    ? {
                        opacity: stage >= 5 ? 0 : 1,
                        y: 0,
                        scale: 1,
                      }
                    : {}
                }
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  opacity: stage >= 5 ? { duration: 0.6, delay: 0 } : {},
                }}
              >
                AI
              </motion.div>

              {/* "Calling" Text */}
              <motion.div
                className="text-6xl md:text-7xl font-semibold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-2"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={
                  stage >= 3
                    ? {
                        opacity: stage >= 5 ? 0 : 1,
                        y: 0,
                        scale: 1,
                      }
                    : {}
                }
                transition={{
                  duration: 0.7,
                  ease: "easeOut",
                  opacity: stage >= 5 ? { duration: 0.6, delay: 0.1 } : {},
                }}
              >
                Calling
              </motion.div>

              {/* "Assistant" Text */}
              <motion.div
                className="text-5xl md:text-6xl font-medium text-gray-300"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={
                  stage >= 4
                    ? {
                        opacity: stage >= 5 ? 0 : 1,
                        y: 0,
                        scale: 1,
                      }
                    : {}
                }
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  opacity: stage >= 5 ? { duration: 0.6, delay: 0.2 } : {},
                }}
              >
                Assistant
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle Background Grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(249, 115, 22, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249, 115, 22, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </motion.div>
  );
}

// Integrations data
const integrationsData = [
  {
    name: "Oracle ERP",
    icon: OracleIcon,
    category: "ERP & Finance",
    categoryId: "erp",
    color: "from-blue-500/20 to-blue-600/10",
    imageSrc: "/integrations/oracle.svg",
  },
  {
    name: "SAP",
    icon: SAPIcon,
    category: "ERP & Finance",
    categoryId: "erp",
    color: "from-blue-500/20 to-blue-600/10",
    imageSrc: "/integrations/sap.svg",
  },
  {
    name: "NetSuite",
    icon: NetSuiteIcon,
    category: "ERP & Finance",
    categoryId: "erp",
    color: "from-blue-500/20 to-blue-600/10",
    imageSrc: "/integrations/netsuite.svg",
  },
  {
    name: "Microsoft Dynamics",
    icon: DynamicsIcon,
    category: "ERP & Finance",
    categoryId: "erp",
    color: "from-blue-500/20 to-blue-600/10",
    imageSrc: "/integrations/microsoft-dynamics.svg",
  },
  {
    name: "Salesforce",
    icon: SalesforceIcon,
    category: "CRM & Sales",
    categoryId: "crm",
    color: "from-blue-400/20 to-blue-500/10",
    imageSrc: "/integrations/salesforce.svg",
  },
  {
    name: "HubSpot",
    icon: HubSpotIcon,
    category: "CRM & Sales",
    categoryId: "crm",
    color: "from-orange-500/20 to-orange-600/10",
    imageSrc: "/integrations/hubspot.svg",
  },
  {
    name: "Zoho",
    icon: ZohoIcon,
    category: "CRM & Sales",
    categoryId: "crm",
    color: "from-blue-500/20 to-blue-600/10",
    imageSrc: "/integrations/zoho.svg",
  },
  {
    name: "Pipedrive",
    icon: PipedriveIcon,
    category: "CRM & Sales",
    categoryId: "crm",
    color: "from-blue-500/20 to-blue-600/10",
    imageSrc: "/integrations/pipedrive.svg",
  },
  {
    name: "Zendesk",
    icon: ZendeskIcon,
    category: "Support",
    categoryId: "support",
    color: "from-green-500/20 to-green-600/10",
    imageSrc: "/integrations/zendesk.svg",
  },
  {
    name: "ServiceNow",
    icon: ServiceNowIcon,
    category: "Support",
    categoryId: "support",
    color: "from-blue-500/20 to-blue-600/10",
    imageSrc: "/integrations/servicenow.svg",
  },
  {
    name: "Freshdesk",
    icon: FreshdeskIcon,
    category: "Support",
    categoryId: "support",
    color: "from-blue-500/20 to-blue-600/10",
    imageSrc: "/integrations/freshdesk.svg",
  },
  {
    name: "Jira",
    icon: JiraIcon,
    category: "Support",
    categoryId: "support",
    color: "from-blue-500/20 to-blue-600/10",
    imageSrc: "/integrations/jira.svg",
  },
  {
    name: "Google Workspace",
    icon: GoogleWorkspaceIcon,
    category: "Productivity",
    categoryId: "productivity",
    color: "from-blue-500/20 to-green-500/10",
    imageSrc: "/integrations/google-workspace.svg",
  },
  {
    name: "Outlook",
    icon: OutlookIcon,
    category: "Productivity",
    categoryId: "productivity",
    color: "from-blue-500/20 to-blue-600/10",
    imageSrc: "/integrations/outlook.svg",
  },
  {
    name: "Teams",
    icon: TeamsIcon,
    category: "Productivity",
    categoryId: "productivity",
    color: "from-blue-500/20 to-purple-500/10",
    imageSrc: "/integrations/teams.svg",
  },
  {
    name: "Slack",
    icon: SlackIcon,
    category: "Productivity",
    categoryId: "productivity",
    color: "from-purple-500/20 to-pink-500/10",
    imageSrc: "/integrations/slack.svg",
  },
  {
    name: "Calendly",
    icon: CalendlyIcon,
    category: "Scheduling",
    categoryId: "scheduling",
    color: "from-blue-500/20 to-blue-600/10",
    imageSrc: "/integrations/calendly.svg",
  },
  {
    name: "Google Calendar",
    icon: GoogleCalendarIcon,
    category: "Scheduling",
    categoryId: "scheduling",
    color: "from-blue-500/20 to-green-500/10",
    imageSrc: "/integrations/google-calendar.svg",
  },
  {
    name: "Outlook Calendar",
    icon: OutlookCalendarIcon,
    category: "Scheduling",
    categoryId: "scheduling",
    color: "from-blue-500/20 to-blue-600/10",
    imageSrc: "/integrations/outlook-calendar.svg",
  },
  {
    name: "Shopify",
    icon: ShopifyIcon,
    category: "Commerce",
    categoryId: "commerce",
    color: "from-green-500/20 to-green-600/10",
    imageSrc: "/integrations/shopify.svg",
  },
  {
    name: "Magento",
    icon: MagentoIcon,
    category: "Commerce",
    categoryId: "commerce",
    color: "from-orange-500/20 to-orange-600/10",
    imageSrc: "/integrations/magento.svg",
  },
  {
    name: "WooCommerce",
    icon: WooCommerceIcon,
    category: "Commerce",
    categoryId: "commerce",
    color: "from-purple-500/20 to-purple-600/10",
    imageSrc: "/integrations/woocommerce.svg",
  },
  {
    name: "BigCommerce",
    icon: BigCommerceIcon,
    category: "Commerce",
    categoryId: "commerce",
    color: "from-blue-500/20 to-blue-600/10",
    imageSrc: "/integrations/bigcommerce.svg",
  },
];

// Integration Category Tab Component
function IntegrationCategoryTab({
  category,
  index,
  isActive,
  onClick,
}: {
  category: { id: string; label: string; icon: string };
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full lg:w-full text-left px-3 lg:px-4 py-2 lg:py-2.5 transition-all duration-200 flex items-center gap-2 lg:gap-3 group relative rounded-lg lg:rounded-none ${
        isActive
          ? "text-white bg-gray-800/40 lg:bg-gray-800/40"
          : "text-gray-400 hover:text-white hover:bg-gray-800/20"
      }`}
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.9 + index * 0.05, duration: 0.4 }}
      whileHover={{ x: 2 }}
    >
      {/* Active indicator - left border (desktop only) */}
      {isActive && (
        <motion.div
          className="hidden lg:block absolute left-0 top-0 bottom-0 w-0.5 bg-orange-500"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
      {/* Active indicator - background (mobile) */}
      {isActive && (
        <motion.div
          className="lg:hidden absolute inset-0 bg-orange-500/10 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
      <span className="text-base">{category.icon}</span>
      <span className="font-medium text-sm whitespace-nowrap">
        {category.label}
      </span>
    </motion.button>
  );
}

// Flow Step Card Component - Unique 3D Floating Design
function FlowStepCard({
  step,
  title,
  description,
  icon,
  index,
}: {
  step: number;
  title: string;
  description: string;
  icon: string;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      className="relative group"
      initial={{ opacity: 0, y: 100, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.15, duration: 0.8, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ perspective: "1000px" }}
    >
      {/* 3D Floating Card */}
      <motion.div
        className="relative h-full p-8 bg-gradient-to-br from-gray-900/60 via-gray-900/40 to-gray-900/60 border border-gray-800/50 rounded-3xl backdrop-blur-xl overflow-hidden"
        whileHover={{
          scale: 1.01,
          rotateY: 5,
          rotateX: -5,
          z: 50,
          boxShadow: "0 30px 60px rgba(249, 115, 22, 0.3)",
        }}
        transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Hexagonal Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(249, 115, 22, 0.1) 2px, rgba(249, 115, 22, 0.1) 4px),
              repeating-linear-gradient(60deg, transparent, transparent 2px, rgba(249, 115, 22, 0.1) 2px, rgba(249, 115, 22, 0.1) 4px),
              repeating-linear-gradient(120deg, transparent, transparent 2px, rgba(249, 115, 22, 0.1) 2px, rgba(249, 115, 22, 0.1) 4px)
            `,
          }}
        />

        {/* Step Number Badge - 3D Effect */}
        <div className="relative mb-6 flex items-center justify-between">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.2, rotate: [0, 360] }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Badge */}
            <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-bold text-2xl shadow-2xl shadow-orange-500/50">
              {step}
            </div>

            {/* 3D Shadow Layers */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-orange-600/50 blur-xl"
              animate={
                isHovered
                  ? {
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }
                  : {}
              }
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />

            {/* Floating Particles */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-orange-400 rounded-full"
                style={{
                  top: "50%",
                  left: "50%",
                }}
                animate={
                  isHovered
                    ? {
                        x: [
                          0,
                          Math.cos((i * Math.PI * 2) / 3) * 40,
                          Math.cos((i * Math.PI * 2) / 3) * 60,
                        ],
                        y: [
                          0,
                          Math.sin((i * Math.PI * 2) / 3) * 40,
                          Math.sin((i * Math.PI * 2) / 3) * 60,
                        ],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }
                    : {}
                }
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>

          {/* Icon with 3D Rotation */}
          <motion.div
            className="text-5xl"
            animate={
              isHovered
                ? {
                    rotateY: [0, 180, 360],
                    rotateZ: [0, 10, -10, 0],
                  }
                : {}
            }
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {icon}
          </motion.div>
        </div>

        {/* Title with 3D Text Effect */}
        <motion.h3
          className="text-xl font-bold text-white mb-4 group-hover:text-orange-300 transition-colors"
          animate={
            isHovered
              ? {
                  textShadow: [
                    "0 0 0px rgba(249, 115, 22, 0)",
                    "0 0 20px rgba(249, 115, 22, 0.8)",
                    "0 0 0px rgba(249, 115, 22, 0)",
                  ],
                }
              : {}
          }
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          {title}
        </motion.h3>

        {/* Description */}
        <p className="text-gray-300 leading-relaxed text-sm">{description}</p>

        {/* Animated Corner Accents */}
        <motion.div
          className="absolute top-0 right-0 w-20 h-20 border-t border-r border-orange-500/30 rounded-tr-3xl"
          animate={
            isHovered
              ? {
                  borderColor: "rgba(249, 115, 22, 0.8)",
                  boxShadow: "0 0 20px rgba(249, 115, 22, 0.5)",
                }
              : {}
          }
        />
        <motion.div
          className="absolute bottom-0 left-0 w-20 h-20 border-b border-l border-orange-500/30 rounded-bl-3xl"
          animate={
            isHovered
              ? {
                  borderColor: "rgba(249, 115, 22, 0.8)",
                  boxShadow: "0 0 20px rgba(249, 115, 22, 0.5)",
                }
              : {}
          }
        />

        {/* Energy Beam Effect */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 + 0.5, duration: 0.8 }}
          animate={
            isHovered
              ? {
                  opacity: [0.5, 1, 0.5],
                  scaleX: [1, 1.1, 1],
                }
              : {}
          }
        />
      </motion.div>

      {/* Connection Line to Next Step (on hover) */}
      {index < 3 && (
        <motion.div
          className="absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}

// Integration Grid Component
function IntegrationGrid({ selectedCategory }: { selectedCategory: string }) {
  const filteredIntegrations = integrationsData.filter(
    (int) => int.categoryId === selectedCategory
  );

  if (filteredIntegrations.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">
          No integrations found in this category.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        delay: 0.5,
        duration: 0.5,
      }}
      whileHover={{
        y: -5,
        boxShadow: "0 20px 40px rgba(249, 115, 22, 0.1)",
      }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <AnimatePresence mode="wait">
        {filteredIntegrations.map((integration, index) => {
          const IconComponent = integration.icon;
          return (
            <div
              key={`${integration.name}-${selectedCategory}`}
              className="group relative overflow-hidden rounded-2xl bg-gray-900/30 border border-gray-800/50 hover:border-orange-500/30 transition-all duration-300"
            >
              {/* Preview Area - Like Osmo Cards */}
              <div
                className={`relative h-48 bg-gradient-to-br ${integration.color} flex items-center justify-center overflow-hidden`}
              >
                <motion.div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {integration.imageSrc ? (
                  <motion.img
                    src={integration.imageSrc}
                    alt={`${integration.name} logo`}
                    className="relative z-10 max-h-14 md:max-h-16 object-contain mix-blend-screen opacity-90"
                    whileHover={{ scale: 1.1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    draggable={false}
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <motion.div
                    className="relative z-10 w-20 h-20 text-white"
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
                    transition={{ duration: 0.3 }}
                  >
                    <IconComponent className="w-full h-full" />
                  </motion.div>
                )}

                {/* Animated background elements */}
                <motion.div
                  className="absolute top-4 right-4 w-2 h-2 bg-orange-400/30 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 0.2,
                  }}
                />
                <motion.div
                  className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-orange-400/20 rounded-full"
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 0.3,
                  }}
                />
              </div>

              {/* Title Below Preview */}
              <div className="p-4">
                <h3 className="text-base font-medium text-white group-hover:text-orange-300 transition-colors">
                  {integration.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {integration.category}
                </p>
              </div>
            </div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}

function MainContent() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("erp");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  // Testimonials data
  const testimonials = [
    {
      name: "Marcus Thompson",
      role: "Sales Director",
      company: "TechCorp Solutions",
      content:
        "AgenticAI has revolutionized our sales process. We've seen a 300% increase in lead qualification rates, and the AI agents never miss a follow-up. The conversation flow is so seamless that prospects genuinely believe they're speaking with a human. Our team now focuses on high-value closing while AgenticAI handles outreach.",
      rating: 5,
      initials: "MT",
    },
    {
      name: "Priya Sharma",
      role: "CEO",
      company: "InnovateLabs",
      content:
        "We went from 50 calls per day to 500, and our conversion rates have tripled. The AI understands context, remembers conversations, and adapts its approach. Our sales team productivity has increased tenfold, and deals are closing faster than ever.",
      rating: 5,
      initials: "PS",
    },
    {
      name: "James Rodriguez",
      role: "VP of Sales",
      company: "GrowthCo Industries",
      content:
        "The natural conversation flow is incredible. Prospects can't tell they're talking to AI. The system handles objections beautifully and maintains context throughout. We've reduced our sales cycle by 40% and increased our win rate significantly.",
      rating: 5,
      initials: "JR",
    },
    {
      name: "Olivia Martinez",
      role: "Marketing Director",
      company: "Digital Dynamics",
      content:
        "The CRM integration was seamless. Our conversion rates have improved dramatically since implementing AgenticAI. The AI syncs conversation data, handles lead scoring automatically, and provides actionable insights. We're seeing a 250% increase in qualified leads.",
      rating: 5,
      initials: "OM",
    },
    {
      name: "Robert Chen",
      role: "Business Development Manager",
      company: "ScaleUp Ventures",
      content:
        "AgenticAI has transformed our sales process. We're closing deals faster, our pipeline is more qualified, and our team has more time for strategic conversations. The AI handles outreach and qualification with precision matching our best sales reps.",
      rating: 5,
      initials: "RC",
    },
  ];

  // Keen Slider setup with auto-play
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    loop: true,
    slideChanged(slider) {
      // Get the centered slide index
      const currentAbs = slider.track.details.abs;

      // Map to testimonial index using modulo
      const testimonialIndex = currentAbs % testimonials.length;
      setCurrentSlide(testimonialIndex);
    },
    created() {
      setLoaded(true);
    },
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: {
          perView: 1.2,
          spacing: 20,
        },
      },
      "(min-width: 768px)": {
        slides: {
          perView: 2,
          spacing: 24,
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 3.5,
          spacing: 24,
          origin: "center",
        },
      },
    },
  });

  // Auto-play functionality
  useEffect(() => {
    if (!loaded || !instanceRef.current) return;

    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 4000); // Move to next slide every 4 seconds

    return () => {
      clearInterval(interval);
    };
  }, [loaded, instanceRef]);

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle contact form submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you can add form submission logic
    alert("Thank you for your message! We will get back to you soon.");
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-black flex flex-col relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(249, 115, 22, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249, 115, 22, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 bg-black/80 backdrop-blur-sm border-b border-gray-800/50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <motion.div
            className="text-white font-medium text-xl md:text-2xl tracking-tight"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <span>Agentic</span>
            <span className="text-orange-400">AI</span>
          </motion.div>

          <div className="flex items-center gap-6 md:gap-8">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <motion.button
                onClick={() => scrollToSection("hero")}
                className="text-gray-300 hover:text-white font-medium text-sm transition-colors relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                Home
                <motion.div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300" />
              </motion.button>
              <motion.button
                onClick={() => scrollToSection("how-it-works")}
                className="text-gray-300 hover:text-white font-medium text-sm transition-colors relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                How It Works
                <motion.div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300" />
              </motion.button>
              <motion.button
                onClick={() => scrollToSection("integrations")}
                className="text-gray-300 hover:text-white font-medium text-sm transition-colors relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                Integrations
                <motion.div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300" />
              </motion.button>
              <motion.button
                onClick={() => scrollToSection("testimonials")}
                className="text-gray-300 hover:text-white font-medium text-sm transition-colors relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                Success Stories
                <motion.div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300" />
              </motion.button>
            </div>

            <motion.button
              className="px-5 py-2.5 md:px-6 md:py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-all text-sm md:text-base"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 4px 12px rgba(249, 115, 22, 0.3)",
              }}
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
              onClick={() => navigate("/auth")}
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <div
        id="hero"
        // style={{ width: '100%', height: '600px', position: 'relative' }}
        className="min-h-screen w-full relative pt-20 md:pt-24"
      >
        <DarkVeil />
        <div className="flex-1 flex items-center justify-center px-6 absolute inset-0 pt-20">
          {/* Hero Content */}
          <div className="text-center max-w-5xl mx-auto relative z-10 mb-32">
            {/* Main Hero Text with Typewriter Effect */}
            <motion.h1
              className="text-5xl md:text-7xl lg:text-7xl font-medium text-white mb-8 leading-tight"
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
            >
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                style={{
                  background:
                    "linear-gradient(90deg, #ffffff, #f97316, #ffffff)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Conversations Without Borders. Automation Without Limits.
              </motion.span>
            </motion.h1>

            {/* Subtitle with Reveal Animation */}
            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8, ease: "easeOut" }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0, duration: 0.5 }}
              >
                AI in under 500ms.{" "}
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.3, duration: 0.5 }}
              >
                Adaptive. Secure.{" "}
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.6, duration: 0.5 }}
              >
                Integrated with 50+ platforms.
              </motion.span>
            </motion.p>

            {/* Enhanced Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.9, duration: 0.8, ease: "easeOut" }}
            >
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-lg text-base hover:from-orange-600 hover:to-orange-800 transition-all shadow-lg hover:shadow-orange-500/25 flex items-center gap-2 relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 3.1, duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 10px 25px rgba(249, 115, 22, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setIsHovering(true)}
                onHoverEnd={() => setIsHovering(false)}
                onClick={() => scrollToSection("contact")}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <motion.span
                  animate={{
                    textShadow: [
                      "0 0 0px rgba(255, 255, 255, 0)",
                      "0 0 10px rgba(255, 255, 255, 0.5)",
                      "0 0 0px rgba(255, 255, 255, 0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  Contact Us
                </motion.span>
                <motion.svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  whileHover={{ x: 3, rotate: 15 }}
                  transition={{ duration: 0.2 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </motion.svg>
              </motion.button>

              <motion.button
                className="px-8 py-4 border border-gray-600 text-gray-300 rounded-lg text-base hover:bg-gray-800/50 hover:border-gray-500 transition-all relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 3.3, duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  borderColor: "rgb(156 163 175)",
                  backgroundColor: "rgba(55, 65, 81, 0.5)",
                  boxShadow: "0 5px 15px rgba(156, 163, 175, 0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setIsHovering(true)}
                onHoverEnd={() => setIsHovering(false)}
                onClick={() => scrollToSection("features")}
              >
                <motion.div
                  className="absolute inset-0 border border-gray-400/20 rounded-lg"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                View Features
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Spacer between hero and trust */}
      <div className="h-24"></div>

      {/* Trust Section */}
      {/* <motion.section
        className="relative z-10 py-32 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            className="text-lg md:text-xl text-gray-400 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Over 50+ business trust us
          </motion.h2>


          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 items-center justify-items-center">
            {[
              { icon: "💬", name: "Logoipsum" },
              { icon: "📊", name: "Logoipsum" },
              { icon: "⭐", name: "Logoipsum" },
              { icon: "🛡️", name: "Logoipsum" },
              { icon: "🔧", name: "Logoipsum" },
            ].map((company, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group cursor-pointer"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  y: -2,
                }}
                onHoverStart={() => setIsHovering(true)}
                onHoverEnd={() => setIsHovering(false)}
              >
                <motion.div
                  className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-lg group-hover:bg-orange-600/20 transition-colors"
                  whileHover={{ rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {company.icon}
                </motion.div>
                <motion.span
                  className="font-medium text-sm md:text-base"
                  animate={{
                    textShadow: [
                      "0 0 0px rgba(251, 146, 60, 0)",
                      "0 0 8px rgba(251, 146, 60, 0.3)",
                      "0 0 0px rgba(251, 146, 60, 0)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 0.5,
                  }}
                >
                  {company.name}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </div>


        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`trust-particle-${i}`}
            className="absolute w-1 h-1 bg-orange-400/20 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 2) * 60}%`,
            }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.8,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.section> */}

      {/* Services Section */}
      <motion.section
        id="services"
        className="relative z-10 py-40 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-150px" }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          {/* Services Badge */}
          {/* <motion.div
            className="inline-flex items-center px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            whileHover={{
              scale: 1.05,
              borderColor: "rgb(249 115 22)",
              backgroundColor: "rgba(249, 115, 22, 0.1)",
            }}
          >
            <motion.span
              className="text-gray-300 text-sm font-medium"
              animate={{
                color: [
                  "rgb(209 213 219)",
                  "rgb(251 146 60)",
                  "rgb(209 213 219)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              Our Services
            </motion.span>
          </motion.div> */}

          {/* Main Heading */}
          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-medium text-white mb-8 leading-tight tracking-tightest"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <motion.span
              className="block mb-2"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              style={{
                background: "linear-gradient(90deg, #ffffff, #f97316, #ffffff)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AI Solutions That Take Your
            </motion.span>
            <motion.span
              className="block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Business to the Next Level
            </motion.span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              We design, develop, and implement automation tools that help you{" "}
            </motion.span>
            <motion.span
              className="text-orange-400 font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              animate={{
                textShadow: [
                  "0 0 0px rgba(251, 146, 60, 0)",
                  "0 0 10px rgba(251, 146, 60, 0.5)",
                  "0 0 0px rgba(251, 146, 60, 0)",
                ],
              }}
              transition={{
                opacity: { delay: 1.5, duration: 0.5 },
                textShadow: {
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: 2,
                },
              }}
            >
              work smarter, not harder
            </motion.span>
          </motion.p>
        </div>
      </motion.section>

      {/* Features Grid Section */}
      <motion.section
        id="features"
        className="relative z-10 py-40 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-150px" }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Features Header */}
          <div className="text-center mb-20">
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="text-gray-300 text-sm font-medium">
                Features
              </span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-6xl font-medium text-white mb-6 leading-tight tracking-tightest"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent">
                Powerful AI Features
              </span>
            </motion.h2>

            <motion.p
              className="text-xl text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Advanced AI capabilities that transform your sales process
            </motion.p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "Smart Lead Qualification",
                description:
                  "AI analyzes and scores leads automatically, identifying the most promising prospects for your sales team.",
              },
              {
                icon: "📞",
                title: "Automated Calling",
                description:
                  "Make hundreds of calls simultaneously with natural-sounding AI voices that engage prospects effectively.",
              },
              {
                icon: "📊",
                title: "Real-time Analytics",
                description:
                  "Get instant insights on call performance, conversion rates, and lead quality with detailed dashboards.",
              },
              {
                icon: "🎯",
                title: "Personalized Scripts",
                description:
                  "Dynamic conversation flows that adapt based on prospect responses and company data.",
              },
              {
                icon: "🔄",
                title: "CRM Integration",
                description:
                  "Seamlessly sync with your existing CRM systems for unified lead management and tracking.",
              },
              {
                icon: "⚡",
                title: "Instant Follow-ups",
                description:
                  "Automated follow-up sequences that nurture leads and schedule meetings without manual intervention.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group p-8 bg-gray-900/30 border border-gray-800/50 rounded-2xl hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                whileHover={{
                  scale: 1.02,
                  y: -5,
                  boxShadow: "0 20px 40px rgba(249, 115, 22, 0.1)",
                }}
                onHoverStart={() => setIsHovering(true)}
                onHoverEnd={() => setIsHovering(false)}
              >
                <motion.div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <motion.div
                  className="text-4xl mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {feature.icon}
                </motion.div>

                <h3 className="text-xl font-medium text-white mb-3 group-hover:text-orange-300 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>

                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-500 to-orange-700"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.8 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Integrations Section */}
      <motion.section
        id="integrations"
        className="relative z-10 py-40 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-150px" }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Integrations Header */}
          <div className="text-center mb-16">
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="text-gray-300 text-sm font-medium">
                Integrations
              </span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-6xl font-medium text-white mb-6 leading-tight tracking-tightest"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent">
                Seamlessly Connect with Your Tools
              </span>
            </motion.h2>

            <motion.p
              className="text-xl text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Integrate with your favorite platforms and automate your entire
              workflow
            </motion.p>
          </div>

          {/* Osmo Style Layout: Sidebar + Grid */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Category Navigation */}
            <motion.aside
              className="w-full lg:w-64 flex-shrink-0"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="lg:sticky lg:top-24">
                <div className="mb-6">
                  <h3 className="text-white font-bold text-lg mb-1">
                    Integrations
                  </h3>
                </div>

                <nav className="flex flex-wrap lg:flex-col gap-2 lg:gap-0 lg:space-y-0.5">
                  {[
                    { id: "erp", label: "ERP & Finance", icon: "💼" },
                    { id: "crm", label: "CRM & Sales", icon: "🎯" },
                    { id: "support", label: "Support", icon: "🎧" },
                    { id: "productivity", label: "Productivity", icon: "📧" },
                    { id: "scheduling", label: "Scheduling", icon: "📅" },
                    { id: "commerce", label: "Commerce", icon: "🛒" },
                  ].map((category, index) => (
                    <IntegrationCategoryTab
                      key={category.id}
                      category={category}
                      index={index}
                      isActive={selectedCategory === category.id}
                      onClick={() => setSelectedCategory(category.id)}
                    />
                  ))}
                </nav>
              </div>
            </motion.aside>

            {/* Right Content Area - Integrations Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                delay: 0.5,
                duration: 0.5,
              }}
              className="flex-1"
            >
              <IntegrationGrid selectedCategory={selectedCategory} />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        id="how-it-works"
        className="relative z-10 py-40 px-6 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-150px" }}
        transition={{ duration: 1 }}
      >
        {/* Animated background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="max-w-6xl mx-auto relative">
          {/* Header */}
          <div className="text-center mb-20">
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="text-gray-300 text-sm font-medium">
                How It Works
              </span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-6xl font-medium text-white mb-6 leading-tight tracking-tightest"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent">
                From Integration to Scale
              </span>
            </motion.h2>
          </div>

          {/* Unique Flow Timeline */}
          <div className="relative py-20">
            {/* Animated Flow Path */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ height: "600px" }}
            >
              <defs>
                <linearGradient
                  id="flowGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#ea580c" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.6" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Wave Path */}
              <motion.path
                d="M 50 300 Q 300 200, 550 300 T 1050 300 T 1550 300"
                fill="none"
                stroke="url(#flowGradient)"
                strokeWidth="2"
                strokeDasharray="10,5"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />

              {/* Animated Particles along path */}
              {[0, 1, 2, 3].map((i) => (
                <motion.circle
                  key={i}
                  r="4"
                  fill="#f97316"
                  filter="url(#glow)"
                  initial={{ offsetDistance: "0%" }}
                  animate={{ offsetDistance: "100%" }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                    delay: i * 0.5,
                  }}
                  style={{
                    offsetPath:
                      "path('M 50 300 Q 300 200, 550 300 T 1050 300 T 1550 300')",
                  }}
                />
              ))}
            </svg>

            {/* Floating Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {[
                {
                  step: 1,
                  title: "Integrate & Launch",
                  description:
                    "50+ plug-and-play integrations with ERP, CRM, support, and commerce.",
                  icon: "🔌",
                },
                {
                  step: 2,
                  title: "Configure Logic in Natural Language",
                  description:
                    "Business users can define workflows. Technical teams maintain guardrails + code control.",
                  icon: "⚙️",
                },
                {
                  step: 3,
                  title: "Observe & Optimize",
                  description:
                    "Pre-launch testing, live audits, AI-powered insights, and Watchtower observability.",
                  icon: "📊",
                },
                {
                  step: 4,
                  title: "Scale & Evolve",
                  description:
                    "From pilot to millions of concurrent interactions across chat, email, and voice.",
                  icon: "🚀",
                },
              ].map((item, index) => (
                <FlowStepCard
                  key={index}
                  step={item.step}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        id="testimonials"
        className="relative z-10 py-20 md:py-40 px-4 md:px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-150px" }}
        transition={{ duration: 1 }}
      >
        <div className="mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <motion.div
              className="inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 bg-gray-800/50 border border-gray-700 rounded-full mb-6 md:mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="text-gray-300 text-xs md:text-sm font-medium">
                Testimonials
              </span>
            </motion.div>

            <motion.h2
              className="text-3xl md:text-4xl lg:text-6xl font-medium text-white mb-4 md:mb-6 leading-tight tracking-tightest px-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent">
                What Our Clients Say
              </span>
            </motion.h2>
          </div>

          {/* Trusted by Section */}
          <motion.div
            className="mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h3 className="text-xl md:text-2xl font-medium text-white text-center mb-6 md:mb-8">
              Trusted by:
            </h3>
            <div className="flex justify-center items-center gap-3 md:gap-4 flex-wrap px-4">
              {testimonials.map((testimonial, index) => (
                <button
                  key={index}
                  onClick={() => {
                    instanceRef.current?.moveToIdx(index);
                  }}
                  className={`relative transition-all duration-300 ${
                    currentSlide === index
                      ? "scale-110 z-10"
                      : "scale-100 hover:scale-105"
                  }`}
                >
                  <div
                    className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-medium text-sm md:text-lg border-2 transition-all duration-300 ${
                      currentSlide === index
                        ? "border-orange-500 shadow-lg shadow-orange-500/50"
                        : "border-gray-700 hover:border-orange-400/50"
                    }`}
                  >
                    {testimonial.initials}
                  </div>
                  {currentSlide === index && (
                    <motion.div
                      className="absolute -bottom-6 md:-bottom-8 left-1/2 transform -translate-x-1/2 bg-black/90 px-2 md:px-3 py-1 rounded text-white text-[10px] md:text-xs font-medium whitespace-nowrap"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {testimonial.name.toUpperCase()}
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Keen Slider */}
          <div className="relative px-4 md:px-0">
            <div ref={sliderRef} className="keen-slider">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="keen-slider__slide min-w-0">
                  <motion.div
                    className="group p-6 md:p-8 bg-[#0E0E0E] border border-gray-800/50 rounded-md hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden h-full"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                    whileHover={{
                      scale: 1.02,
                      y: -5,
                      boxShadow: "0 20px 40px rgba(249, 115, 22, 0.1)",
                    }}
                  >
                    <motion.div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="flex mb-4 flex-wrap">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span
                          key={i}
                          className="text-yellow-400 text-base md:text-xl"
                        >
                          ⭐
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-300 mb-6 leading-relaxed font-bold text-sm md:text-base">
                      {testimonial.content}
                    </p>

                    <div className="flex items-center flex-wrap gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center text-white font-medium text-sm md:text-base flex-shrink-0">
                        {testimonial.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-white font-medium uppercase text-sm md:text-base truncate">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-400 text-xs md:text-sm truncate">
                          {testimonial.role} at {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {/* {loaded && instanceRef.current && (
              <>
                <button
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    instanceRef.current?.prev();
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-gray-900/80 border border-gray-700 flex items-center justify-center text-white transition-all duration-300 hover:bg-gray-800 hover:border-orange-500/50"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    instanceRef.current?.next();
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-gray-900/80 border border-gray-700 flex items-center justify-center text-white transition-all duration-300 hover:bg-gray-800 hover:border-orange-500/50"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )} */}
          </div>
        </div>
      </motion.section>

      {/* Pricing Section */}
      <motion.section
        id="pricing"
        className="relative z-10 py-40 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-150px" }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="text-gray-300 text-sm font-medium">Pricing</span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-6xl font-medium text-white mb-6 leading-tight tracking-tightest"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent">
                Simple, Transparent Pricing
              </span>
            </motion.h2>

            <motion.p
              className="text-xl text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Choose the plan that fits your business needs
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$299",
                period: "/month",
                description: "Perfect for small teams getting started",
                features: [
                  "Up to 1,000 calls/month",
                  "Basic AI scripts",
                  "Email support",
                  "CRM integration",
                  "Basic analytics",
                ],
                popular: false,
              },
              {
                name: "Professional",
                price: "$799",
                period: "/month",
                description: "Ideal for growing sales teams",
                features: [
                  "Up to 5,000 calls/month",
                  "Advanced AI scripts",
                  "Priority support",
                  "Advanced CRM integration",
                  "Detailed analytics",
                  "Custom voice training",
                  "A/B testing",
                ],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                description: "For large organizations with custom needs",
                features: [
                  "Unlimited calls",
                  "Custom AI development",
                  "Dedicated support",
                  "White-label solution",
                  "Advanced security",
                  "Custom integrations",
                  "SLA guarantee",
                ],
                popular: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                className={`group relative p-8 rounded-2xl border transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-500 scale-105"
                    : "bg-gray-900/50 border-gray-800 hover:border-orange-500/50"
                }`}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: plan.popular ? 1.05 : 1,
                }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
                whileHover={{
                  scale: plan.popular ? 1.08 : 1.02,
                  y: -5,
                  boxShadow: plan.popular
                    ? "0 25px 50px rgba(249, 115, 22, 0.2)"
                    : "0 20px 40px rgba(249, 115, 22, 0.1)",
                }}
              >
                {plan.popular && (
                  <motion.div
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-700 text-white text-sm font-medium rounded-full"
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                  >
                    Most Popular
                  </motion.div>
                )}

                <motion.div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                <div className="relative">
                  <h3 className="text-2xl font-medium text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-400 mb-6">{plan.description}</p>

                  <div className="mb-8">
                    <span className="text-4xl md:text-5xl font-medium text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-400 ml-2">{plan.period}</span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        className="flex items-center text-gray-300"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 1.4 + index * 0.2 + featureIndex * 0.1,
                          duration: 0.4,
                        }}
                      >
                        <motion.span
                          className="text-orange-400 mr-3"
                          whileHover={{ scale: 1.2 }}
                          transition={{ duration: 0.2 }}
                        >
                          ✓
                        </motion.span>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>

                  <motion.button
                    className={`w-full py-4 rounded-xl font-medium transition-all relative overflow-hidden ${
                      plan.popular
                        ? "bg-gradient-to-r from-orange-500 to-orange-700 text-white hover:from-orange-600 hover:to-orange-800"
                        : "border border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:border-gray-500"
                    }`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onHoverStart={() => setIsHovering(true)}
                    onHoverEnd={() => setIsHovering(false)}
                    onClick={() =>
                      plan.name === "Enterprise"
                        ? scrollToSection("contact")
                        : navigate("/auth")
                    }
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    {plan.name === "Enterprise"
                      ? "Contact Sales"
                      : "Get Started"}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="contact"
        className="relative z-10 py-40 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-150px" }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="text-gray-300 text-sm font-medium">Contact</span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-6xl font-medium text-white mb-6 leading-tight tracking-tightest"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent">
                Ready to Get Started?
              </span>
            </motion.h2>

            <motion.p
              className="text-xl text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Let's discuss how AgenticAI can transform your sales process
            </motion.p>
          </div>

          <motion.div
            className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 md:p-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <form className="space-y-6" onSubmit={handleContactSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.0, duration: 0.6 }}
                >
                  <label className="block text-gray-300 mb-2 font-medium">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none transition-colors"
                    placeholder="John"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                >
                  <label className="block text-gray-300 mb-2 font-medium">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none transition-colors"
                    placeholder="Doe"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <label className="block text-gray-300 mb-2 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="john@company.com"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                <label className="block text-gray-300 mb-2 font-medium">
                  Company
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="Your Company"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.4, duration: 0.6 }}
              >
                <label className="block text-gray-300 mb-2 font-medium">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your sales challenges..."
                />
              </motion.div>

              <motion.button
                type="submit"
                className="w-full py-4 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-all relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.5, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovering(true)}
                onHoverEnd={() => setIsHovering(false)}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="relative z-10 py-20 px-6 border-t border-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="text-white font-medium text-2xl mb-4">
                <span>Agentic</span>
                <span className="text-orange-400">AI</span>
              </div>
              <p className="text-gray-400 mb-6">
                Transforming sales with intelligent AI calling assistants that
                work 24/7.
              </p>
              <div className="flex space-x-4">
                {["📧", "🐦", "💼", "📱"].map((icon, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-orange-600 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {[
              {
                title: "Product",
                links: [
                  {
                    name: "Features",
                    action: () => scrollToSection("features"),
                  },
                  { name: "Pricing", action: () => scrollToSection("pricing") },
                  { name: "API", action: () => navigate("/auth") },
                  { name: "Documentation", action: () => navigate("/auth") },
                ],
              },
              {
                title: "Company",
                links: [
                  { name: "About", action: () => scrollToSection("services") },
                  { name: "Blog", action: () => navigate("/auth") },
                  { name: "Careers", action: () => navigate("/auth") },
                  { name: "Contact", action: () => scrollToSection("contact") },
                ],
              },
              {
                title: "Support",
                links: [
                  { name: "Help Center", action: () => navigate("/auth") },
                  { name: "Community", action: () => navigate("/auth") },
                  { name: "Status", action: () => navigate("/auth") },
                  { name: "Security", action: () => navigate("/auth") },
                ],
              },
            ].map((section, sectionIndex) => (
              <motion.div
                key={sectionIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + sectionIndex * 0.1, duration: 0.6 }}
              >
                <h3 className="text-white font-medium mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <motion.li key={linkIndex}>
                      <motion.button
                        className="text-gray-400 hover:text-white transition-colors text-left"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                        onClick={link.action}
                      >
                        {link.name}
                      </motion.button>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2024 AgenticAI. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {[
                { name: "Privacy Policy", action: () => navigate("/auth") },
                { name: "Terms of Service", action: () => navigate("/auth") },
                { name: "Cookie Policy", action: () => navigate("/auth") },
              ].map((link, index) => (
                <motion.button
                  key={index}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  onClick={link.action}
                >
                  {link.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.footer>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-full shadow-lg hover:shadow-orange-500/25 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
          >
            <motion.svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </motion.svg>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
