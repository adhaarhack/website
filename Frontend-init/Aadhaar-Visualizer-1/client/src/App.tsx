import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "./pages/Dashboard";
import FrictionIndex from "./pages/modules/FrictionIndex";
import LifeEventIntelligence from "./pages/modules/LifeEventIntelligence";
import BlindSpotDetector from "./pages/modules/BlindSpotDetector";
import ShockResilience from "./pages/modules/ShockResilience";
import UpdateParadox from "./pages/modules/UpdateParadox";
import IdentityEntropy from "./pages/modules/IdentityEntropy";
import SilentFailureZones from "./pages/modules/SilentFailureZones";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/friction-index" component={FrictionIndex} />
      <Route path="/life-event" component={LifeEventIntelligence} />
      <Route path="/blind-spot" component={BlindSpotDetector} />
      <Route path="/shock-resilience" component={ShockResilience} />
      <Route path="/update-paradox" component={UpdateParadox} />
      <Route path="/identity-entropy" component={IdentityEntropy} />
      <Route path="/failure-zones" component={SilentFailureZones} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
