import { CartComponent } from './cart.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BookService } from '../../services/book.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Book } from '../../models/book.model';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

const listBook: Book[] = [
    {
        name: '',
        author: '',
        isbn: '',
        price: 15,
        amount: 2
    },
    {
        name: '',
        author: '',
        isbn: '',
        price: 20,
        amount: 1
    },
    {
        name: '',
        author: '',
        isbn: '',
        price: 8,
        amount: 7
    }
];

const matDialogMock = {
    open: () => {
        return {
            afterClosed: () => of(true)
        }
    }
};


describe('Cart component', () => {

    let component: CartComponent;
    let fixture: ComponentFixture<CartComponent>;
    let service: BookService;

    beforeEach( () => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
            declarations: [
                CartComponent
            ],
            providers: [
                BookService,
                {
                    provide: MatDialog,
                    useValue: matDialogMock
                }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();
    });

    beforeEach( () => {
        fixture = TestBed.createComponent(CartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        service = fixture.debugElement.injector.get(BookService);
        spyOn(service, 'getBooksFromCart').and.callFake( () => listBook);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });


    it('getTotalPrice returns an amount', () => {
        const totalPrice = component.getTotalPrice(listBook);
        expect(totalPrice).toBeGreaterThan(0);
        expect(totalPrice).not.toBeNull();
    });

    it('onInputNumberChange increments correctly', () => {
        const action = 'plus';
        const book = {
            name: '',
            author: '',
            isbn: '',
            price: 15,
            amount: 2
        };

        const spy1 = spyOn(service, 'updateAmountBook').and.callFake( ()=> null);
        const spy2 = spyOn(component, 'getTotalPrice').and.callFake( ()=> null);

        expect(book.amount).toBe(2);
        
        component.onInputNumberChange(action, book);

        expect(book.amount === 3).toBeTrue();

        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();

    });    
    

    it('onInputNumberChange decrements correctly', () => {
        const action = 'minus';
        const book = {
            name: '',
            author: '',
            isbn: '',
            price: 15,
            amount: 3
        };

        expect(book.amount).toBe(3);

        const spy1 = spyOn(service, 'updateAmountBook').and.callFake( ()=> null);
        const spy2 = spyOn(component, 'getTotalPrice').and.callFake( ()=> null);
        
        component.onInputNumberChange(action, book);

        expect(book.amount).toBe(2);

        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();

    });

    it('onClearBooks works correctly', () => {
        const spy1 = spyOn((component as any), '_clearListCartBook').and.callThrough();
        const spy2 = spyOn(service, 'removeBooksFromCart').and.callFake( () => null);
        component.listCartBook = listBook;
        component.onClearBooks();
        expect(component.listCartBook.length).toBe(0);
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('_clearListCartBook works correctly', () => {
        const spy1 = spyOn(service, 'removeBooksFromCart').and.callFake( () => null);
        component.listCartBook = listBook;
        component["_clearListCartBook"]();

        expect(component.listCartBook.length).toBe(0);
        expect(spy1).toHaveBeenCalled();

    });

});