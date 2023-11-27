import { FC, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form, FormItem, FormLabel } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { RxCross2 } from 'react-icons/rx';
import axios from "axios";
import { toast } from "react-toastify";

interface CreateGroupProps {
    friends: any;
}

interface GroupForm {
    name: string;
    description: string;
}

const CreateGroup: FC<CreateGroupProps> = ({
    friends
}) => {
    const form = useForm<GroupForm>();
    const [members, setMembers] = useState<any[]>([]);
    const [selectedMember, setSelectedMember] = useState<any>();

    useEffect(() => {
        if (friends) {
            setMembers(friends.map((friend: any) => ({ ...friend, selected: false })));
        }
    }, [friends])

    const onSubmit: SubmitHandler<GroupForm> = (data) => {
        const formData = { ...data, memberIds: members.filter(member => member.selected).map(member => member._id) }
        axios.post('/api/group', formData).then(data => {
            toast.success(data.data.message);
        }).catch(err => {
            toast.error(err.response.data.message);
        })
    }

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="text-base">
                        Create Group
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex justify-center">Create a Group</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormItem>
                                <FormLabel htmlFor="group_name">Group Name</FormLabel>
                                <Input
                                    id="group_name"
                                    type="text"
                                    {...form.register("name")}
                                />
                            </FormItem>
                            <FormItem>
                                <FormLabel htmlFor="group_desc">Group Description</FormLabel>
                                <Input
                                    id="group_desc"
                                    type="text"
                                    {...form.register("description")}
                                />
                            </FormItem>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    {members?.map((member: any) => {
                                        if (!member.selected) return null;
                                        return <div key={member._id} className="flex items-center py-2 px-4 gap-4 bg-secondary rounded-md">
                                            <div className="flex-1 flex gap-6">
                                                <span>{member.name}</span>
                                                <Badge className="">{member.email}</Badge>
                                            </div>
                                            <div className="p-1 cursor-pointer hover:text-destructive"
                                                onClick={() => {
                                                    setMembers(prev => {
                                                        const index = prev.findIndex(member => member._id === selectedMember);
                                                        prev[index].selected = false;
                                                        return [...prev];
                                                    });
                                                }}
                                            >
                                                <RxCross2 />
                                            </div>
                                        </div>
                                    })}
                                </div>
                                <div className="flex items-end gap-4">
                                    <FormItem className="flex-1">
                                        <FormLabel htmlFor="members">Members</FormLabel>
                                        <Select onValueChange={(value) => setSelectedMember(value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent autoFocus>
                                                {members?.map((friend: any, index: any) => {
                                                    if (friend.selected) return null;
                                                    return <SelectItem key={friend._id} value={friend._id} className="w-full">
                                                        <div className="w-full flex gap-6">
                                                            <span className="">
                                                                {friend.name}
                                                            </span>
                                                            <Badge className="">{friend.email}</Badge>
                                                        </div>
                                                    </SelectItem>
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                    <Button type="button" onClick={() => {
                                        if (selectedMember) {
                                            setMembers(prev => {
                                                const index = prev.findIndex(member => member._id === selectedMember);
                                                prev[index].selected = true;
                                                return [...prev];
                                            });
                                        }
                                    }}>
                                        Add
                                    </Button>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                {/* <DialogClose asChild> */}
                                <Button type="submit">
                                    Create
                                </Button>
                                {/* </DialogClose> */}
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CreateGroup;