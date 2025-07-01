"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  MessageSquare, 

  User, 
   
  Paperclip, 
  Send,
  Settings,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  getSupportTicketById, 
  addSupportResponse, 
  updateSupportTicketStatus 
} from "@/lib/actions/support";
import { 
  addResponseSchema,
  updateTicketStatusSchema,
  type AddResponseData,
  type UpdateTicketStatusData
} from "@/lib/types/support";

type ResponseFormData = AddResponseData;
type StatusUpdateFormData = UpdateTicketStatusData;

interface SupportTicketModalProps {
  ticketId: number;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const statusConfig = {
  open: { label: "Open", color: "bg-orange-100 text-orange-800", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-800", icon: AlertTriangle },
  waiting_for_user: { label: "Waiting for User", color: "bg-yellow-100 text-yellow-800", icon: User },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-800", icon: CheckCircle },
  closed: { label: "Closed", color: "bg-gray-100 text-gray-800", icon: CheckCircle }
};

const priorityConfig = {
  low: { label: "Low", color: "bg-gray-100 text-gray-800" },
  medium: { label: "Medium", color: "bg-blue-100 text-blue-800" },
  high: { label: "High", color: "bg-orange-100 text-orange-800" },
  urgent: { label: "Urgent", color: "bg-red-100 text-red-800" }
};

export function SupportTicketModal({ ticketId, isOpen, onClose, onUpdate }: SupportTicketModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);

  const responseForm = useForm<ResponseFormData>({
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(addResponseSchema) as any,
    defaultValues: {
      message: "",
      isInternal: false
    }
  });

  const statusForm = useForm<StatusUpdateFormData>({
    resolver: zodResolver(updateTicketStatusSchema),
    defaultValues: {
      status: "open",
      resolutionNotes: "",
      assignedTo: ""
    }
  });

  const fetchTicket = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getSupportTicketById(ticketId);
      if (result.success) {
        setTicket(result.data);
        statusForm.reset({
          status: result.data?.status as "open" | "in_progress" | "waiting_for_user" | "resolved" | "closed" || "open",
          assignedTo: result.data?.assignedTo || "",
          resolutionNotes: result.data?.resolutionNotes || ""
        });
      } else {
        toast.error("Failed to load ticket");
        onClose();
      }
    } catch (error) {
      console.error("Error fetching ticket:", error);
      toast.error("Error loading ticket");
      onClose();
    } finally {
      setLoading(false);
    }
  }, [ticketId, statusForm, onClose]);

  useEffect(() => {
    if (isOpen && ticketId) {
      fetchTicket();
    }
  }, [isOpen, ticketId, fetchTicket]);

  const handleAddResponse = async (data: ResponseFormData) => {
    setSubmitting(true);
    try {
      const result = await addSupportResponse({
        ticketId,
        message: data.message,
        isInternal: data.isInternal,
        attachmentUrl: null
      });

      if (result.success) {
        toast.success("Response added successfully");
        responseForm.reset();
        fetchTicket();
        onUpdate();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error adding response:", error);
      toast.error("Failed to add response");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (data: StatusUpdateFormData) => {
    setSubmitting(true);
    try {
      const result = await updateSupportTicketStatus({
        ticketId,
        status: data.status,
        resolutionNotes: data.resolutionNotes || null,
        assignedTo: data.assignedTo || null
      });

      if (result.success) {
        toast.success("Ticket status updated successfully");
        setShowStatusUpdate(false);
        fetchTicket();
        onUpdate();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!ticket) return null;

  const statusInfo = statusConfig[ticket.status as keyof typeof statusConfig];
  const priorityInfo = priorityConfig[ticket.priority as keyof typeof priorityConfig];
  const StatusIcon = statusInfo?.icon || Clock;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {ticket.ticketNumber}
                </DialogTitle>
                <p className="text-sm text-gray-600">{ticket.subject}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={priorityInfo?.color}>
                {priorityInfo?.label}
              </Badge>
              <Badge className={statusInfo?.color}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusInfo?.label}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          {/* Main Content */}
          <div className="lg:col-span-2 flex flex-col">
            {/* Ticket Details */}
            <Card className="flex-shrink-0 mb-4">
              <CardHeader>
                <CardTitle className="text-base">Ticket Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-900 mb-1">Description</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{ticket.description}</p>
                </div>
                
                {ticket.attachmentUrl && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-1">Attachment</h4>
                    <a 
                      href={ticket.attachmentUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Paperclip className="h-3 w-3" />
                      View Attachment
                    </a>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <span className="ml-2 font-medium">
                      {format(new Date(ticket.createdAt), "MMM dd, yyyy 'at' HH:mm")}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Updated:</span>
                    <span className="ml-2 font-medium">
                      {format(new Date(ticket.updatedAt), "MMM dd, yyyy 'at' HH:mm")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Responses */}
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <CardTitle className="text-base">Conversation</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {ticket.responses && ticket.responses.length > 0 ? (
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      ticket.responses.map((response: any) => (
                        <div 
                          key={response.id} 
                          className={`p-3 rounded-lg ${
                            response.responderRole === 'admin' 
                              ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                              : 'bg-gray-50 border-l-4 border-l-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">
                                {response.responderName}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {response.responderRole}
                              </Badge>
                              {response.isInternal && (
                                <Badge variant="destructive" className="text-xs">
                                  Internal
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              {format(new Date(response.createdAt), "MMM dd, HH:mm")}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{response.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-8">
                        No responses yet
                      </p>
                    )}
                  </div>
                </ScrollArea>

                <Separator className="my-4" />

                {/* Add Response Form */}
                <Form {...responseForm}>
                  <form onSubmit={responseForm.handleSubmit(handleAddResponse)} className="space-y-3">
                    <FormField
                      control={responseForm.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Type your response..."
                              className="min-h-[80px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex items-center justify-between">
                      <FormField
                        control={responseForm.control}
                        name="isInternal"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="rounded border-gray-300"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Internal note (not visible to user)
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" disabled={submitting} size="sm">
                        <Send className="h-3 w-3 mr-1" />
                        Send
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* User Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{ticket.userName}</p>
                  <p className="text-sm text-gray-600">{ticket.userEmail}</p>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Management */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Ticket Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowStatusUpdate(!showStatusUpdate)}
                >
                  Update Status
                </Button>

                {showStatusUpdate && (
                  <Form {...statusForm}>
                    <form onSubmit={statusForm.handleSubmit(handleStatusUpdate)} className="space-y-3">
                      <FormField
                        control={statusForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-8 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="waiting_for_user">Waiting for User</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {(statusForm.watch("status") === "resolved" || statusForm.watch("status") === "closed") && (
                        <FormField
                          control={statusForm.control}
                          name="resolutionNotes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Resolution Notes</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe how this issue was resolved..."
                                  className="min-h-[60px] text-sm"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <div className="flex gap-2">
                        <Button type="submit" disabled={submitting} size="sm" className="flex-1">
                          Update
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowStatusUpdate(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 