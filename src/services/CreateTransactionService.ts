/* eslint-disable prettier/prettier */
// import AppError from '../errors/AppError';
import { getRepository, getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository'
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: string;
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category }:Request ): Promise<Transaction> {

    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);
    let categorytable:Category

    const balance = await transactionRepository.getBalance();

    if (type === "outcome") {
      if (value > balance.total) {
        throw new AppError('não tem dinheiro');
      }
    }

    const categoryExists  = await categoryRepository.findOne({
      where: { title: category },
    });

    if (categoryExists) {
      categorytable = categoryExists;
    } else {
      categorytable = categoryRepository.create({
        title: category
      });
      await categoryRepository.save(categorytable);
    }

    const newTransaction = transactionRepository.create({
      title,
      type,
      value,
      category: categorytable
    });
    await transactionRepository.save(newTransaction);

    return newTransaction;

  }
}

export default CreateTransactionService;
