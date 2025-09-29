import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHourglassHalf,
  FaCheckCircle,
  FaShieldAlt,
  FaClock,
  FaEnvelope,
} from "react-icons/fa";
import { motion } from "framer-motion";

const PendingApproval = () => {
  const navigate = useNavigate();
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const iconVariants = {
    animate: {
      rotate: [0, -5, 0, 5, 0],
      scale: [1, 1.05, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const floatingVariants = {
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const features = [
    {
      icon: FaShieldAlt,
      title: "Secure Verification",
      description:
        "Your information is protected with enterprise-grade security",
    },
    {
      icon: FaClock,
      title: "24-48 Hours",
      description: "Typically approved within two business days",
    },
    {
      icon: FaEnvelope,
      title: "Email Notification",
      description: "We'll notify you immediately upon approval",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-r from-yellow-200 to-orange-300 rounded-full blur-3xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-r from-blue-200 to-purple-300 rounded-full blur-3xl opacity-20"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <motion.div
        className="bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl max-w-4xl w-full border border-white/20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            {/* Header Section */}
            <motion.div
              className="text-center lg:text-left"
              variants={itemVariants}
            >
              <motion.div
                className="inline-flex items-center justify-center lg:justify-start mb-6"
                variants={itemVariants}
              >
                <motion.div
                  className="relative"
                  variants={floatingVariants}
                  animate="float"
                >
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl"
                    variants={iconVariants}
                    animate="animate"
                  >
                    <FaHourglassHalf className="text-white text-2xl" />
                  </motion.div>

                  {/* Animated Rings */}
                  <motion.div
                    className="absolute inset-0 border-2 border-yellow-300 rounded-2xl"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.8, 0, 0.8],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 border border-yellow-200 rounded-2xl"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 0, 0.6],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  />
                </motion.div>
              </motion.div>

              <motion.h1
                className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-4"
                variants={itemVariants}
              >
                Awaiting Approval
              </motion.h1>

              <motion.p
                className="text-lg text-gray-700 mb-4 leading-relaxed"
                variants={itemVariants}
              >
                Your account has been submitted successfully and is currently
                under review by our team.
              </motion.p>

              <motion.p className="text-gray-600 mb-8" variants={itemVariants}>
                We're carefully reviewing your application to ensure the best
                experience for our community.
              </motion.p>
            </motion.div>

            {/* Loading Indicator */}
            <motion.div
              className="flex items-center justify-center lg:justify-start"
              variants={itemVariants}
            >
              <div className="flex items-center space-x-3 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex space-x-1.5">
                  {[0, 1, 2].map((index) => (
                    <motion.div
                      key={index}
                      className="w-2.5 h-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        duration: 1,
                        delay: index * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
                <span className="text-gray-700 font-semibold">
                  Processing{dots}
                </span>
              </div>
            </motion.div>

            {/* Action Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                onClick={() => navigate("/login")}
                className="w-full lg:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-4 px-8 rounded-2xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-xl hover:shadow-2xl relative overflow-hidden group"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Return to Login</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column - Features */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-gray-800 text-center lg:text-left">
              What's Next?
            </h3>

            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="flex items-start space-x-4 p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:scale-[1.02]"
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <feature.icon className="text-white text-lg" />
                </motion.div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Timeline */}
            <motion.div
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
              variants={itemVariants}
            >
              <h4 className="font-semibold text-gray-800 mb-3 text-center">
                Approval Timeline
              </h4>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="text-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
                  <div>Submitted</div>
                </div>
                <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
                  <div>Review</div>
                </div>
                <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                  <div>Approved</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          className="mt-12 pt-6 border-t border-gray-200 text-center"
          variants={itemVariants}
        >
          <p className="text-sm text-gray-500">
            Developed by{" "}
            <a
              href="https://www.linkedin.com/in/sabbir-rahman-9a077620b/"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sabbir Rahman
            </a>{" "}
            & <span className="text-blue-600 font-medium">Shahriar Samir</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PendingApproval;
