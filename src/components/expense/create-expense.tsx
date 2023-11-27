import { FC, useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Form, FormItem, FormLabel } from "../ui/form";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { MdDelete } from 'react-icons/md';
import axios from "axios";
import { toast } from "react-toastify";



interface CreateExpenseProps {
    friendsData: any;
}

interface ExpenseForm {
    amount: number;
    comments: string;
    friendsAmount: {
        userId: string;
        share: number;
    }[];
}

const CreateExpense: FC<CreateExpenseProps> = ({
    friendsData
}) => {
    const form = useForm<ExpenseForm>({
        defaultValues: {
            amount: 0,
            comments: '',
            friendsAmount: []
        }
    });

    const [friends, setFriends] = useState<any[]>([]);
    const [selectFriend, setSelectFriend] = useState<any>();
    const [changedShares, setChangedShares] = useState<any>([]);

    const { fields, append, remove } = useFieldArray({ control: form.control, name: 'friendsAmount' })

    useEffect(() => {
        if (friendsData) {
            setFriends(friendsData.map((friend: any) => ({ ...friend, selected: false })));
        }
    }, [friendsData])

    const calculateAmount = (index: number) => {

        return ''
    }

    const addNewFriend = () => {
        if (selectFriend) {
            const index = friends.findIndex(friend => friend._id === selectFriend);
            friends[index].selected = true;
            setFriends([...friends]);
            // const amount = form.getValues('amount');
            // const friendsAmount = form.getValues('friendsAmount');

            // const changedTotal= changedShares.reduce((curr:number,prev:number)=>{
            //     return friendsAmount.find((friend:any)=>friend.userId===curr)?.share as number + prev
            // } , 0)
            append({ userId: selectFriend, share: 0 }, { shouldFocus: false });
        }
    }

    const onSubmit: SubmitHandler<ExpenseForm> = (data) => {
        axios.post('/api/expense', data).then(data => {
            toast.success(data.data.message);
        }).catch(err => {
            toast.error(err.response.data.message);
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="text-base">
                    Add Expense
                </Button>
            </DialogTrigger>
            <DialogContent className="gap-6">
                <DialogHeader>
                    <DialogTitle className="flex justify-center">Invite a Friend</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormItem>
                            <FormLabel htmlFor="amount">Amount to Settle</FormLabel>
                            <Input
                                id="amount"
                                type="number"
                                {...form.register('amount')}
                            />
                        </FormItem>
                        <FormItem>
                            <FormLabel htmlFor="description">Comments</FormLabel>
                            <Input
                                id="comments"
                                type="text"
                                {...form.register('comments')}
                            />
                        </FormItem>
                        <FormItem className="flex flex-col gap-4">
                            <div className="text-md font-bold text-center" >Friends</div>
                            <div className="flex flex-col gap-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex items-center px-1 gap-4">
                                        <div className="flex grow">
                                            {friends?.find((fr: any) => fr._id === field.userId)?.name}
                                        </div>
                                        <Input
                                            className="w-fit"
                                            id={`friends[${index}].share`}
                                            type="number"
                                            {...form.register(`friendsAmount.${index}.share` as const)}
                                        />
                                        <Button variant={'destructive'} className="p-2" onClick={() => {
                                            setFriends(prev => {
                                                const index = prev.findIndex(friend => friend._id === field.userId);
                                                prev[index].selected = false;
                                                return [...prev];
                                            })
                                            remove(index)
                                        }}>
                                            <MdDelete size={18} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </FormItem>
                        <FormItem className="flex items-end gap-4">
                            <Select onValueChange={(value) => setSelectFriend(value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent autoFocus>
                                    {friends?.map((friend: any) => {
                                        if (friend.selected) return null;
                                        return <SelectItem key={friend._id} value={friend._id} className="w-full">
                                            <div className="w-full flex gap-6">
                                                <span className="">
                                                    {friend.name}
                                                </span>
                                                <Badge>{friend.email}</Badge>
                                            </div>
                                        </SelectItem>
                                    })}
                                </SelectContent>
                            </Select>
                            <Button
                                type="button"
                                disabled={(form.getValues('amount') as any === '' || form.getValues('amount') === 0) && selectFriend}
                                onClick={addNewFriend}>
                                Add
                            </Button>
                        </FormItem>
                        <Button type="submit">
                            Add Expense
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateExpense;