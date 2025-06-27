import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCurrentUserProfile } from "@/lib/actions/user.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Camera,
  Save,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default async function ProfileEditPage() {
  // Check if user is authenticated
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  // Get user profile
  const userProfile = await getCurrentUserProfile();

  if (!userProfile) {
    redirect('/profile/setup');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/profile" 
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
              <p className="text-gray-600">Update your personal information and preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Picture Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-blue-600" />
                Profile Picture
              </CardTitle>
              <CardDescription>
                Update your profile picture to personalize your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 border-4 border-gray-200">
                  <AvatarImage 
                    src={userProfile.profileImage || ""} 
                    alt={`${userProfile.firstName} ${userProfile.lastName}`}
                  />
                  <AvatarFallback className="text-xl font-bold bg-blue-100 text-blue-600">
                    {userProfile.firstName?.[0]}{userProfile.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Picture
                  </Button>
                  <p className="text-sm text-gray-500">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your basic personal details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      defaultValue={userProfile.firstName}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      defaultValue={userProfile.lastName}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="email" 
                      type="email"
                      defaultValue={userProfile.email}
                      placeholder="Enter your email"
                      className="pl-10"
                      disabled
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Email cannot be changed as it's linked to your authentication
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="phoneNumber" 
                      type="tel"
                      defaultValue={userProfile.phoneNumber || ""}
                      placeholder="Enter your phone number"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="country" 
                      defaultValue={userProfile.country || ""}
                      placeholder="Enter your country"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="organization" 
                      defaultValue={userProfile.organization || ""}
                      placeholder="Enter your organization"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    defaultValue={userProfile.bio || ""}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                  <p className="text-sm text-gray-500">
                    Brief description about yourself and your work
                  </p>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href="/profile">
                      Cancel
                    </Link>
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                Account Settings
              </CardTitle>
              <CardDescription>
                Manage your account preferences and security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Account Status</h4>
                    <p className="text-sm text-gray-500">Your account is active and verified</p>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Active
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Role</h4>
                    <p className="text-sm text-gray-500">Your current role in the system</p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {userProfile.role?.replace('_', ' ') || 'Applicant'}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Member Since</h4>
                    <p className="text-sm text-gray-500">When you joined YouthADAPT</p>
                  </div>
                  <div className="text-sm font-medium">
                    {new Date(userProfile.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 