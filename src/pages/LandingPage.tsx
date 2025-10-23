import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
                className="text-8xl md:text-9xl font-bold text-white mb-4"
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

function MainContent() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const navigate = useNavigate();

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
      {/* Enhanced Starry Background */}
      <div className="absolute inset-0">
        {[...Array(150)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 2 + 0.5 + "px",
              height: Math.random() * 2 + 0.5 + "px",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.8, 0.2, 0.6, 0],
              scale: [0, 1, 0.9, 1.1, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 6, // Much slower: 6-14 seconds
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 10 + 2, // Longer delay: 2-12 seconds
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Animated Grid Background */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(249, 115, 22, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249, 115, 22, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "80px 80px"],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Mouse Follower Effect */}
      <motion.div
        className="fixed pointer-events-none z-50"
        style={{
          left: mousePosition.x - 100,
          top: mousePosition.y - 100,
          width: "200px",
          height: "200px",
          background:
            "radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(20px)",
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.8 : 0.3,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Navigation */}
      <motion.nav
        className="relative z-50 p-6 pb-12"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <motion.div
            className="text-white font-bold text-2xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
          >
            <motion.span
              animate={{
                textShadow: [
                  "0 0 0px rgba(249, 115, 22, 0)",
                  "0 0 10px rgba(249, 115, 22, 0.5)",
                  "0 0 0px rgba(249, 115, 22, 0)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              Agentic
            </motion.span>
            <span className="text-orange-400">AI</span>
          </motion.div>

          <div className="flex items-center space-x-4">
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-800 transition-all relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              whileHover={{
                scale: 1.05,
                y: -2,
                boxShadow: "0 10px 25px rgba(249, 115, 22, 0.3)",
              }}
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
              onClick={() => navigate("/auth")}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              Get Started
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 relative pt-20">
        {/* Enhanced Orange Orb Background */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
        >
          <motion.div
            className="relative"
            animate={{
              rotateY: [0, 360],
              rotateX: [0, 15, -15, 0],
            }}
            transition={{
              rotateY: {
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              },
              rotateX: {
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
            }}
            style={{
              transform: `translate(${mousePosition.x * 0.02}px, ${
                mousePosition.y * 0.02
              }px)`,
            }}
          >
            {/* Outer Ring */}
            <motion.div
              className="absolute -inset-20 rounded-full border border-orange-500/20"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: {
                  duration: 30,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                },
                scale: {
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                },
              }}
            />

            {/* Main Orb */}
            <motion.div
              className="w-96 h-96 rounded-full relative"
              style={{
                background:
                  "radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, rgba(251, 146, 60, 0.3) 30%, rgba(249, 115, 22, 0.2) 60%, transparent 100%)",
                filter: "blur(40px)",
              }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            {/* Pulsing Rings */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border border-orange-400/30"
                style={{
                  margin: `${i * 20}px`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.5,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Inner Orb */}
            <motion.div
              className="absolute inset-8 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(251, 146, 60, 0.6) 0%, rgba(249, 115, 22, 0.4) 50%, transparent 80%)",
                filter: "blur(20px)",
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.6, 0.8, 0.6],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            {/* Core */}
            <motion.div
              className="absolute inset-16 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(254, 215, 170, 0.8) 0%, rgba(251, 146, 60, 0.6) 40%, transparent 70%)",
                filter: "blur(10px)",
              }}
              animate={{
                scale: [0.9, 1.2, 0.9],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            {/* Orbiting Particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-orange-400 rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  transformOrigin: `0 ${150 + i * 20}px`,
                }}
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Hero Content */}
        <div className="text-center max-w-5xl mx-auto relative z-10 mb-32">
          {/* Main Hero Text with Typewriter Effect */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight"
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
                background: "linear-gradient(90deg, #ffffff, #f97316, #ffffff)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Let AI Make Your Sales Calls
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
              AI agents qualify leads &{" "}
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.3, duration: 0.5 }}
            >
              deliver closing scores,{" "}
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.6, duration: 0.5 }}
            >
              automating your sales process
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
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-orange-800 transition-all shadow-lg hover:shadow-orange-500/25 flex items-center gap-2 relative overflow-hidden"
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
              className="px-8 py-4 border border-gray-600 text-gray-300 rounded-lg font-semibold text-lg hover:bg-gray-800/50 hover:border-gray-500 transition-all relative overflow-hidden"
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
          <motion.div
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
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight"
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
              className="text-orange-400 font-semibold"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.5, duration: 0.5 }}
              animate={{
                textShadow: [
                  "0 0 0px rgba(251, 146, 60, 0)",
                  "0 0 10px rgba(251, 146, 60, 0.5)",
                  "0 0 0px rgba(251, 146, 60, 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: 2,
              }}
            >
              work smarter, not harder
            </motion.span>
          </motion.p>
        </div>

        {/* Background Decorative Elements */}
        <motion.div
          className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(251, 146, 60, 0.15) 0%, transparent 70%)",
            filter: "blur(15px)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Geometric Shapes */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`services-geo-${i}`}
            className="absolute pointer-events-none"
            style={{
              left: `${20 + i * 20}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            initial={{ opacity: 0, rotate: 0 }}
            whileInView={{ opacity: 0.3, rotate: 360 }}
            viewport={{ once: true }}
            transition={{
              delay: 1.5 + i * 0.3,
              duration: 2,
              ease: "easeOut",
            }}
            animate={{
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            {i % 2 === 0 ? (
              <div className="w-3 h-3 border border-orange-400/30 rotate-45" />
            ) : (
              <div className="w-2 h-2 bg-orange-400/20 rounded-full" />
            )}
          </motion.div>
        ))}

        {/* Connecting Lines */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 2, duration: 1 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`line-${i}`}
              className="absolute w-px bg-gradient-to-b from-transparent via-orange-400/20 to-transparent"
              style={{
                height: "200px",
                left: `${i * 100}px`,
                transformOrigin: "bottom center",
                transform: `rotate(${i * 60}deg)`,
              }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 2.5 + i * 0.2, duration: 1 }}
              animate={{
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
              }}
            />
          ))}
        </motion.div>
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
              className="text-4xl md:text-6xl font-bold text-white mb-6"
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
                className="group p-8 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-orange-500/50 transition-all duration-300 relative overflow-hidden"
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

                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-orange-300 transition-colors">
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

      {/* Testimonials Section */}
      <motion.section
        id="testimonials"
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
              <span className="text-gray-300 text-sm font-medium">
                Testimonials
              </span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-6xl font-bold text-white mb-6"
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Sales Director",
                company: "TechCorp",
                content:
                  "AgenticAI increased our lead qualification rate by 300%. The AI agents work 24/7 and never miss a follow-up.",
                rating: 5,
              },
              {
                name: "Michael Chen",
                role: "CEO",
                company: "StartupXYZ",
                content:
                  "We went from 50 calls per day to 500. The ROI was immediate and our sales team can focus on closing deals.",
                rating: 5,
              },
              {
                name: "Emily Rodriguez",
                role: "VP Sales",
                company: "GrowthCo",
                content:
                  "The natural conversation flow is incredible. Prospects can't tell they're talking to AI. Game-changing technology.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="group p-8 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-orange-500/50 transition-all duration-300 relative overflow-hidden"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + index * 0.2, duration: 0.6 }}
                whileHover={{
                  scale: 1.02,
                  y: -5,
                  boxShadow: "0 20px 40px rgba(249, 115, 22, 0.1)",
                }}
              >
                <motion.div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.span
                      key={i}
                      className="text-yellow-400 text-xl"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 1 + index * 0.2 + i * 0.1,
                        duration: 0.3,
                      }}
                    >
                      ⭐
                    </motion.span>
                  ))}
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center text-white font-semibold mr-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </motion.div>
                  <div>
                    <h4 className="text-white font-semibold">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
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
              className="text-4xl md:text-6xl font-bold text-white mb-6"
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
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-700 text-white text-sm font-semibold rounded-full"
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
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-400 mb-6">{plan.description}</p>

                  <div className="mb-8">
                    <span className="text-4xl md:text-5xl font-bold text-white">
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
                    className={`w-full py-4 rounded-lg font-semibold transition-all relative overflow-hidden ${
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
              className="text-4xl md:text-6xl font-bold text-white mb-6"
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
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-800 transition-all relative overflow-hidden"
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
              <div className="text-white font-bold text-2xl mb-4">
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
                <h3 className="text-white font-semibold mb-4">
                  {section.title}
                </h3>
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

      {/* Enhanced Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed rounded-full pointer-events-none"
          style={{
            width: Math.random() * 4 + 2 + "px",
            height: Math.random() * 4 + 2 + "px",
            left: `${10 + i * 4}%`,
            top: `${20 + (i % 5) * 15}%`,
            background: `rgba(249, 115, 22, ${Math.random() * 0.5 + 0.2})`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0.5, 1, 0],
            scale: [0, 1, 0.8, 1.2, 0],
            y: [-50, -200, -50],
            x: [0, Math.sin(i) * 30, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 6 + i * 0.2,
            repeat: Number.POSITIVE_INFINITY,
            delay: 1.5 + i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating Geometric Shapes */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`geo-${i}`}
          className="fixed pointer-events-none"
          style={{
            left: `${20 + i * 10}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          initial={{ opacity: 0, rotate: 0 }}
          animate={{
            opacity: [0, 0.3, 0],
            rotate: [0, 360],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 8 + i,
            repeat: Number.POSITIVE_INFINITY,
            delay: 2 + i * 0.5,
            ease: "linear",
          }}
        >
          {i % 3 === 0 ? (
            <div className="w-4 h-4 border border-orange-400/30 rotate-45" />
          ) : i % 3 === 1 ? (
            <div className="w-3 h-3 bg-orange-400/20 rounded-full" />
          ) : (
            <div
              className="w-4 h-4 border border-orange-400/30"
              style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
            />
          )}
        </motion.div>
      ))}

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

      {/* Ambient Light Rays */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`ray-${i}`}
          className="fixed pointer-events-none"
          style={{
            left: "50%",
            top: "50%",
            width: "2px",
            height: "100px",
            background:
              "linear-gradient(to top, transparent, rgba(249, 115, 22, 0.3), transparent)",
            transformOrigin: "bottom center",
            transform: `rotate(${i * 60}deg)`,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scaleY: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
}
