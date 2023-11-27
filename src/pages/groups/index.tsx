import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import fetcher from "@/utils/fetcher";
import { NextPage } from "next";
import { toast } from "react-toastify";
import useSwr from 'swr';
import axios from 'axios';
import CreateGroup from "@/components/group/create-group";
import Link from "next/link";

const Groups: NextPage = () => {
    const { data: friendsData, mutate: mutateFriend, isLoading: isFriendDataLoading } = useSwr<any>('/api/friend', fetcher);

    const { data: groupData, mutate: mutateGroup, isLoading: isGroupDataLoading } = useSwr<any>('/api/group', fetcher);

    const handleFriendInvite = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email-friend');
        axios.post('/api/friend', { email }).then(data => {
            toast.success(data.data.message);
            mutateFriend();
        }).catch(err => {
            toast.error(err.response.data.message);
        })
    }


    return (
        <div className="p-4 flex flex-col gap-4">
            <div className="flex mt-2">
                <Tabs defaultValue="groups" className="w-full md:px-12 px-2">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="groups">Groups</TabsTrigger>
                        <TabsTrigger value="friends">Friends</TabsTrigger>
                    </TabsList>
                    <TabsContent value="groups" className="mt-6">
                        <Card className="md:px-8">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    Joined Groups
                                    <CreateGroup friends={friendsData?.friends} />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                {!isGroupDataLoading && groupData?.groups?.map((group: any) => (
                                    <Link href={`/groups/${group._id}`} key={group._id}>
                                        <div className="flex md:flex-row items-center gap-8 bg-secondary p-4 pl-6 rounded-md">
                                            <Avatar>
                                                <AvatarFallback className="bg-primary">{group.name[0].toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-xl">{group.name}</span>
                                                <span className="text-gray-400">{group.description}</span>
                                            </div>
                                        </div>
                                    </Link>

                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="friends" className="mt-6">
                        <Card className="md:px-8">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    Friends
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="text-base">
                                                Invite Friend
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="gap-6">
                                            <DialogHeader>
                                                <DialogTitle className="flex justify-center">Invite a Friend</DialogTitle>
                                            </DialogHeader>
                                            <form className="flex flex-col gap-4" onSubmit={handleFriendInvite}>
                                                <div className="flex flex-col gap-2">
                                                    <Label htmlFor="email-friend">Email to Invite</Label>
                                                    <Input id="email-friend" name="email-friend" type="email" />
                                                </div>
                                                <div className="flex justify-center">
                                                    {/* <DialogClose asChild> */}
                                                    <Button type="submit">
                                                        Invite
                                                    </Button>
                                                    {/* </DialogClose> */}
                                                </div>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {!isFriendDataLoading && friendsData?.friends?.map((friend: any) => (
                                    <div key={friend._id} className="flex md:flex-row items-center gap-8 bg-secondary p-4 pl-6 rounded-md">
                                        <Avatar>
                                            <AvatarImage src={friend.image} />
                                            <AvatarFallback>{friend.name[0].toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-xl">{friend.name}</span>
                                            <span className="text-gray-400">{friend.email}</span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}


export default Groups;