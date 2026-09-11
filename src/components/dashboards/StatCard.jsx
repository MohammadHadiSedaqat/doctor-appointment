import React from "react";
import { motion } from "framer-motion";
import StatCounter from "@/components/StatCounter";

export default function StatCard({ icon: Icon, label, value, suffix = "", color = "primary", delay = 0 }) {
  const colors = {
    primary: "from-primary/10 to-primary/5 text-primary",
    secondary: "from-secondary/10 to-secondary/5 text-secondary",
    accent: "from-accent/10 to-accent/5 text-accent",
    success: "from-success/10 to-success/5 text-success",
    warning: "from-warning/10 to-warning/5 text-warning",
  };
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5 }} className="rounded-2xl border border-border bg-white p-5 shadow-soft">
      <div className={`mb-3 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${colors[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="font-display text-3xl font-extrabold text-foreground">
        <StatCounter value={value} suffix={suffix} />
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
}