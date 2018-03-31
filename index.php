<?php
session_start();
$loc="../";
require_once($loc . "php/functions.php");
load();
if(!is_user($id,$username,$hashed, $GameName)) redirect_to('../login.php');

$query="SELECT qzPoints FROM users WHERE id ={$id} limit 1";
$resultss_set=mysqli_query($con,$query) or die ('III: '.mysqli_error($con));
$results = mysqli_fetch_array($resultss_set);
if (mysqli_num_rows($resultss_set) > 0) {
	$qzPoints = $results['qzPoints'];
}  else {
	$qzPoints = 0;
}

?>


<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">

        <title>Collapsible sidebar using Bootstrap 3</title>
        <script>
            let playerName = '<?php echo ($GameName)?>';
            let playerScore = '<?php echo ($qzPoints)?>';
            let playerUserName = '<?php echo ($_SESSION['username'])?>';
        </script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script type="text/javascript" src="/platform/kingsGame/resources/socket.io.js"></script>
<script src="client.js"></script>
<script src="client.js"> </script>

<!-- Popper JS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>

<!-- Latest compiled JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
<link rel="stylesheet" type="text/css" href="css/bootstrap.css">
<link rel="stylesheet" type="text/css" href="css/fontawesome-all.css">
        <!-- Our Custom CSS -->
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
<script type="text/javascript">
            var aniamtintim;
            function gogo(){
               $('.map').addClass('map_animate');
               $('.map').removeClass('hidden');
               $('.gmaer1').removeClass('hidden');
               $('.gmaer2').removeClass('hidden');
               $('.start_game').addClass('hidden');   
               $('.search_gamer_block').addClass('hidden');
               $('.blar').addClass('hidden');


                aniamtintim =  setTimeout(function(){
                $('.map').removeClass('map_animate');
               $('.gmaer1').addClass('hidden');
               $('.gmaer2').addClass('hidden');
               $('.map').addClass('hidden');
               $('.start_game').removeClass('hidden');

                  
                 }, 6800);
            }
</script>
        

        <div class="wrapper">
            <!-- Sidebar Holder -->
          
               <aside id="sidebar" class="game_left_side d-inline-block">
	   	<div class="person_info d-flex align-items-center justify-content-center">
		      	 <div class="avatar">
		      	 	<img src="images/img_avatar.png">
		      	 </div>
		      	 <div class="text_info">
                 <?php echo '<div class="name">'. $GameName . '</div>' ?>
		      	 
		      	 <div class="point">
		      	   <span><?php echo $qzPoints ?></span> ქულა
		      	 </div>
		      	 <div class="blance">
		      	   ბალანსი<span>40:00</span> ₾
		      	 </div>
		      	</div>
		  </div>
		  <div class="energi_point  w-50 mt-3 mb-3 mx-auto d-flex ">
		  	  <div class="col d-flex align-items-center justify-content-center">
		  	  	 <i class="fas fa-star"></i><span>17</span>
		  	  </div>
		  	  <div class="col d-flex align-items-center justify-content-center">
		  	  	 <i class="fas fa-bolt"></i><span>17</span>
		  	  </div>
		  </div>
		  <div class="chart text-center mb-2">
              <span> </span>
		  	 <img class="mx-3" src="images/chart.svg">
		  	  <span> </span>
		  </div>
		  <div class="game_tabs">
		  	   <!-- Nav tabs -->
  <ul class="nav nav-tabs" role="tablist">
    <li class="nav-item">
      <a class="nav-link active" data-toggle="tab" href="#game_menu">ყოველდღიური</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-toggle="tab" href="#game_menu1"> ყოველკვირეული</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-toggle="tab" href="#game_menu2">ყოველთვიური</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-toggle="tab" href="#game_menu3">ჯამური</a>
    </li>
  </ul>

  <!-- Tab panes -->
  <div class="tab-content">
    <div id="game_menu" class="container tab-pane active ">    
    	<div class="saarch_up_stuent d-flex align-items-center justify-content-center ">
    	 <div class="avatar d-flex align-items-center justify-content-center">
    	 	<div class="text-center">
    	 		 <i class="fas fa-users"></i>
    	 	</div>
    	 </div>
    	 <div>
    	<!--  <input class="formClear" value="+ 3 მოსწავლე" type="#" name=""><button><i class="fas fa-search"></i></button> -->

        <button onclick="gogo()" class="alternativ">  + 3 მოსწავლე <i class="fas fa-random"></i> </button>
    	</div>
    </div>
    

    <div id = "onlineUsersList" class="row gameer_reitings">
    	 <div class="col p-1 align-self-center">
    	 	 <div class="gamer text-center mx-auto ">
    	 	 	 <div class="avatar d-flex justify-content-center align-items-center">
    	 	 	 	 <div>
    	 	 	 	 	  <img src="images/img_avatar.png">
    	 	 	 	 </div>
    	 	 	 </div>
    	 	 	<div> N: <span>4</span></div>
    	 	 	<div class="name"> 
    	 	 		salome
    	 	 	</div>
    	 	 	<div class="point">
    	 	 		<span>1000</span> qula
    	 	 	</div>
    	 	 	<div class="bolt" onclick="gogo()">
    	 	 		<i class="fas fa-bolt"></i>
    	 	 	</div>
    	 	 </div>
    	 </div>
    	  <div class="col p-1 align-self-center ">
    	 	 <div class="gamer mx-auto curent text-center">
    	 	 	 <div class="avatar d-flex justify-content-center align-items-center">
    	 	 	 	 <div>
    	 	 	 	 	  <img src="images/img_avatar.png">
    	 	 	 	 </div>
    	 	 	 </div>
    	 	 	<div class="number"> N: <span>4</span></div>
    	 	 	<div class="name"> 
    	 	 		სალომე
    	 	 	</div>
    	 	 	<div class="point">
    	 	 		<span>1000</span> ქულა
    	 	 	</div>
    	 	 	<!-- <div class="bolt d-flex justify-content-center align-items-center">
    	 	 		<i class="fas fa-bolt"></i>
    	 	 	</div> -->
    	 	 </div>
    	 </div>
    	  <div class="col p-1 align-self-center ">
    	 	 <div class="gamer mx-auto  text-center">
    	 	 	 <div class="avatar d-flex justify-content-center align-items-center">
    	 	 	 	 <div>
    	 	 	 	 	  <img src="images/img_avatar.png">
    	 	 	 	 </div>
    	 	 	 </div>
    	 	 	<div> N: <span>4</span></div>
    	 	 	<div class="name"> 
    	 	 		salome
    	 	 	</div>
    	 	 	<div class="point">
    	 	 		<span>1000</span> qula
    	 	 	</div>
    	 	 	<div onclick="gogo()" class="bolt d-flex align-items-center justify-content-center">
    	 	 		<i class="fas fa-bolt"></i>
    	 	 	</div>
    	 	 </div>
    	 </div>
    </div>
    <div class="saarch_up_stuent d-flex align-items-center justify-content-center ">
    	 <div class="avatar d-flex align-items-center justify-content-center">
    	 	<div class="text-center">
    	 		 <i class="fas fa-users"></i>
    	 	</div>
    	 </div>
    	 <div>
    	 <!-- <input class="formClear" value="+ 3 მოსწავლე" type="#" name=""><button><i class="fas fa-search"></i></button> -->
      
      <button onclick="gogo()" class="alternativ">  + 3 მოსწავლე <i class="fas fa-random"></i> </button>
    	</div>
    </div>

    <div class="cheleng">
            <a id="chelengfrend" href="#">გამოიწვიე მეგობარი
                  <div class="bolt d-flex align-items-center justify-content-center">
            <i class="fas fa-bolt"></i>
          </div>
            </a>
     </div>
    </div>
    <div id="game_menu1" class="container tab-pane fade"><br>
      <h3>Menu 1</h3>
      <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    </div>
    <div id="game_menu2" class="container tab-pane fade"><br>
      <h3>Menu 2</h3>
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
    </div>
    <div id="game_menu3" class="container tab-pane fade"><br>
      <h3>Menu 2</h3>
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
    </div>
  </div>
		  </div>
	   </aside>
           

            <!-- Page Content Holder -->
            <div id="content">
   
                <div class="">
                    <div class="container-fluid">

                        <div class="navbar-header">
                            <button type="button" id="sidebarCollapse" class="navbar-btn">
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                        </div>

                      
                    </div>
                </div>

                
              <div class="map">
                  <img class="map" src="images/map23.png">
                  <div class="gmaer1 hidden">
                     <div class="avatar">
                        <img src="images/img_avatar.png">
                     </div>
                     <img src="images/Group8.svg">
                  </div>
                  <div class="gmaer2 hidden">
                     <div class="avatar">
                        <img src="images/img_avatar.png">
                     </div>
                     <img src="images/Group9.svg">
                    
                  </div>
              </div>
              <div class="blar hidden">
     
   </div>
              <!-- search gamer  -->

                 <div class="search_gamer_block hidden">
                      <div class="players">
                           <div class="left d-inline-block ">
                           <span> <img src="images/img_avatar.png"> </span>
        
                           </div>
                           <div class="right float-right">
                            <i class="fas fa-question-circle"></i>
                                <span> <img src="images/img_avatar.png"> </span>
                           </div>
                      </div> 
                       <div class="search_box">
                        <div class="d-flex align-items-center justify-content-center ">
                            <input class="formClear" type="#" value="მოძებნე მეგობარი" name=""> <button><i class="fas fa-search"></i></button>
                        </div>
                            <br>
                            <div class="search_resalts">
                                   <div class="searched_gamers d-flex align-items-center justify-content-center">
                                        <div class="avatar ">
                                           <img src="images/img_avatar.png">
                                        </div>
                                        <div class="gamer_info d-flex align-items-center">
                                           <span class="number"> N:<span>6</span> </span> 
                                           სალომე <sapn class='pint'> 1000 </sapn> ქულა
                                        </div>
                                        <a href="" onclick=" gogo()" class="bolt d-flex justify-content-center align-items-center">
                                              <i class="fas fa-bolt"></i>
                                        </a>

                                   </div>

                                   <div class="searched_gamers d-flex align-items-center justify-content-center">
                                        <div class="avatar ">
                                           <img src="images/img_avatar.png">
                                        </div>
                                        <div class="gamer_info d-flex align-items-center">
                                           <span class="number"> N:<span>6</span> </span> 
                                           სალომე <sapn class='pint'> 1000 </sapn> ქულა
                                        </div>
                                        <a href=""  class="bolt d-flex justify-content-center align-items-center">

                                             <i class="fas fa-bolt"></i>
                                        </a>

                                   </div>
                                   <div class="searched_gamers d-flex align-items-center justify-content-center">
                                        <div class="avatar ">
                                           <img src="images/img_avatar.png">
                                        </div>
                                        <div class="gamer_info d-flex align-items-center">
                                           <span class="number"> N:<span>6</span> </span> 
                                           სალომე <sapn class='pint'> 1000 </sapn> ქულა
                                        </div>
                                        <a href="" class="bolt d-flex justify-content-center align-items-center">

                                             <i class="fas fa-bolt"></i>
                                        </a>

                                   </div>
                                   <div class="searched_gamers d-flex align-items-center justify-content-center">
                                        <div class="avatar ">
                                           <img src="images/img_avatar.png">
                                        </div>
                                        <div class="gamer_info d-flex align-items-center">
                                           <span class="number"> N:<span>6</span> </span> 
                                           სალომე <sapn class='pint'> 1000 </sapn> ქულა
                                        </div>
                                        <a href="" class="bolt d-flex justify-content-center align-items-center">

                                             <i class="fas fa-bolt"></i>
                                        </a>

                                   </div>
                            </div>

                       </div> 
                       </div>

                       <!--============== end search gamers=============== -->









                       <!-- ====================start game=================== -->

                       <div class="start_game hidden">
                              <div class="gamerVSgamer d-flex align-items-center  justify-content-between ">
                                   <div class="gamerVS  text-center ">
                                     <div class="outline d-flex align-items-center justify-content-center">
                                     <div class="avatar">
                                        <div class="star">
                                        <div class="point">900</div>
                                        <i class="fas fa-star"></i>
                                        </div>

                                        <img src="images/img_avatar.png">
                                    </div>
                                </div>
                                <div class="name">
                                    თაკო
                                </div>
                                <div class="number">
                                   N:5
                                </div>
                                <div class="point">
                                     <span>800</span> ქულა
                                </div>
                                   </div>
                                   <div class="boltVS">
                                        <img class="" src="images/Path.png">
                                   </div>
                                   <div class="gamerVS text-center">
                                         <div class="outline d-flex align-items-center justify-content-center">
                                     <div class="avatar">
                                        <div class="star">
                                        <div class="point">900</div>
                                        <i class="fas fa-star"></i>
                                        </div>

                                        <img src="images/img_avatar.png">
                                    </div>
                                </div>
                                <div class="name">
                                    თაკო
                                </div>
                                <div class="number">
                                   N:5
                                </div>
                                <div class="point">
                                     <span>800</span> ქულა
                                </div>
                                   </div>
                              </div>
                              <div class="text-center">

                                 <button  class="start_btn btn">დაწყება</button>
                                  
                              </div>
                       </div>
                       <!--================= end start game ===============-->


 <div id = "question_page" class="question_page hidden">
                           
                       
                       <div class="VStiemer ">
                              <div style=" " id="timer_line" class="Timer_line">
                                    
                              </div>
                              <div class="outVS d-flex align-items-center justify-content-between">
                              <div class="VS2 d-flex align-items-center ">
                                    <div class="outline d-flex align-items-center justify-content-center">
                                     <div class="avatar">
                                        <div class="star">
                                        <div class="point">900</div>
                                        <i class="fas fa-star"></i>
                                        </div>

                                        <img src="images/img_avatar.png">
                                    </div>
                                    
                                </div>
                                <div class="name">
                                         თაკო
                                          <div class="point2">
                                        20
                                    </div>
                                    </div>
                                   
                              </div>
                          

                          <div class="timer">
                              <i class="fas fa-stopwatch"></i> <span id="game_timer_time" class="timer_time">10</span>
                          </div>
                          <div class="outVS d-flex align-items-center">
                              <div class="VS2 d-flex align-items-center ">
                                <div class="name">
                                         თაკო
                                          <div class="point2 text-right">
                                        20
                                    </div>
                                    </div>
                                    <div class="outline d-flex align-items-center justify-content-center">
                                     <div class="avatar">
                                        <div class="star">
                                        <div class="point">900</div>
                                        <i class="fas fa-star"></i>
                                        </div>

                                        <img src="images/img_avatar.png">
                                    </div>
                                    
                                </div>
                                
                                   
                              </div>
                          </div>
                       </div>
                   </div>

                     <div class="question_block">
                           <div class="question">
                                კითხვა კითხვა კითხვა კითხვა კითხვა კითხვა კითხვა
                           </div>
                           <div class="container">
                            <div class="row d-flex justify-content-between">
                                <a href=""> 
                                <div class="answer corect">
                                     dsfs fdsfsd  sdf fsf saf sd s  sdgse gvfsd gs
                                    
                                </div>
                                 </a>
                                <a href="">
                                 <div class="answer other ">
                                     dfsfs 
                                </div>
                                </a>
                                <a href="#">
                                  <div class="answer wrong">
                                    dfsfs
                                </div>
                            </a>
                            <a href="#">
                                  <div class="answer">
                                    dfsfs
                                </div>
                            </a>
                            </div>
                           </div>

                     </div>

                   </div>



                   <!-- ===========  end question================== -->



                  <!-- <div class="end_game">
                    <div class="win lost  text-center">
                         <span>შენ წააგე</span>  <span> შენ მოიგე</span>
                    </div>
                         <div class="VStiemer ">
                              
                              <div class="outVS d-flex align-items-center justify-content-between">
                              <div class="VS2 red d-flex align-items-center ">
                                 <div class="name">
                                        
                                          <div class="point2 red">
                                        20
                                    </div>
                                    </div>
                                    <div class="outline d-flex align-items-center justify-content-center">
                                     <div class="avatar">
                                        <div class="star">
                                        <div class="point">900</div>
                                        <i class="fas fa-star"></i>
                                        </div>

                                        <img src="images/img_avatar.png">
                                    </div>
                                    
                                </div>
                               
                                   
                              </div>
                          

                          <div class="timer">
                             <img src="images/Path.png">
                          </div>
                          <div class="outVS d-flex align-items-center">
                              <div class="VS2 green  d-flex align-items-center ">
                                
                                    <div class="outline d-flex align-items-center justify-content-center">
                                     <div class="avatar">
                                        <div class="star">
                                        <div class="point">900</div>
                                        <i class="fas fa-star"></i>
                                        </div>

                                        <img src="images/img_avatar.png">
                                    </div>
                                    
                                </div>
                                <div class="name">
                                      
                                          <div class="point2 green text-right">
                                        20
                                    </div>
                                    </div>
                                
                                   
                              </div>
                          </div>
                       </div>
                   </div>

                   <div class="btn_group d-flex justify-content-between">
                      <a href="#"> გაიმორე თამაში </a>
                      <a href="#"> კითხვების ნახვა </a>
                      <a href="#"> გმოიწვიე და შეეჯიბრე </a>
                   </div>


                  </div> -->

       <!-- ================================ -->


  <!--  <div class="Previous_questions"> 
        <div class="Previous_question_block" >
              <div class="VStiemer ">
                              <div class="Timer_line">
                                    
                              </div>
                              <div class="outVS d-flex align-items-center justify-content-between">
                              <div class="VS2 d-flex align-items-center ">
                                    <div class="outline d-flex align-items-center justify-content-center">
                                     <div class="avatar">
                                        <div class="star">
                                        <div class="point">900</div>
                                        <i class="fas fa-star"></i>
                                        </div>

                                        <img src="images/img_avatar.png">
                                    </div>
                                    
                                </div>
                                <div class="name">
                                         თაკო
                                          <div class="point2">
                                        20
                                    </div>
                                    </div>
                                   
                              </div>
                          

                          <div class="timer">
                              <i class="fas fa-stopwatch"></i> <span class="timer_time">20</span>
                          </div>
                          <div class="outVS d-flex align-items-center">
                              <div class="VS2 d-flex align-items-center ">
                                <div class="name">
                                         თაკო
                                          <div class="point2 text-right">
                                        20
                                    </div>
                                    </div>
                                    <div class="outline d-flex align-items-center justify-content-center">
                                     <div class="avatar">
                                        <div class="star">
                                        <div class="point">900</div>
                                        <i class="fas fa-star"></i>
                                        </div>

                                        <img src="images/img_avatar.png">
                                    </div>
                                    
                                </div>
                                
                                   
                              </div>
                          </div>
                       </div>
                   </div>


                   <div class="qestion">
                      საბეჭდი და ტიპოგრაფიული ინდუსტრიის უშინაარსო ტექსტია. იგი სტანდარტად 1500-იანი
                   </div>
                  <div class="ansvers ">
                        <div class="ansvers_box corect d-flex align-items-center justify-content-center">
                            <span>სწორი პასუხი</span>
                        </div>
                        <div class="ansvers_box wrong d-flex align-items-center justify-content-center">
                            <span>არასწორი პასუხი</span>
                        </div>
                        <div class="ansvers_box d-flex align-items-center justify-content-center">
                            <span>სავარაუდო პასუხი</span>
                        </div>
                        <div class="ansvers_box d-flex align-items-center justify-content-center">
                            <span>სავარაუდო პასუხი</span>
                        </div>
                  </div>

                  
                     <a class="previous" href="#"><i class="fas fa-angle-left"></i>  </a>
                     <a class="next" href="#"> <i class="fas fa-angle-right"></i> </a>
                
        </div>
        <div class="question_caunt text-center my-3 ">
            <span>1</span>/<span>7</span>
        </div>
        <div class="btn_group d-flex justify-content-between mt-5">
           <a href="#">გაიმეორე თამაში</a>
           <a href="#">გამოიწვიე და შეეჯიბრე</a>
        </div>
   </div>
 -->


<!-- ============================================= -->



                 </div>


       

               
            </div>
        </div>


    


        <!-- jQuery CDN -->
         <!-- script src="https://code.jquery.com/jquery-1.12.0.min.js"></script> -->
         <!-- Bootstrap Js CDN -->
         <!-- <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
 -->
         <script type="text/javascript">


             $(document).ready(function () {
            // serchi
            $('#chelengfrend').click(function(){

                $('.search_gamer_block').toggleClass('hidden')
                $('.blar').toggleClass('hidden');
                $('.start_game').addClass('hidden');
                $('.gmaer1').addClass('hidden');
                $('.gmaer2').addClass('hidden');
                $('.map').removeClass('map_animate');
                $('.map').removeClass('hidden');
                 clearTimeout(aniamtintim);
                
            })
            $('.blar').click(function(){
                $(this).toggleClass('hidden');
                $('.search_gamer_block').toggleClass('hidden');

            });

            $('.start_btn').click(function(){
                   
                $('.start_game').addClass('hidden');
                $('.question_page').removeClass('hidden');


                 var timeleft = 10;
                     var transitonFor=10;
var downloadTimer = setInterval(function(){
   
  document.getElementById("game_timer_time").innerHTML =timeleft;
  document.getElementById("timer_line").style.width=0+'%';
  document.getElementById("timer_line").style.transition = transitonFor+'s';
  document.getElementById("timer_line").style.transitionTimingFunction='linear'

  if(timeleft <= 0){
    clearInterval(downloadTimer)
  }
timeleft--;
  

},1000);
            })





                 $('#sidebarCollapse').on('click', function () {
                     $('#sidebar').toggleClass('active');
                     $(this).toggleClass('active');
                 });
             });


             $(function(){
      
      $('.formClear').each(function(index, element) {
    var $element = $(element);
    var defaultValue = $element.val();
    // $element.css('background-color', '#555555');
    $element.focus(function() {
        var actualValue = $element.val();
        if (actualValue == defaultValue) {
            $element.val('');
            // $element.css('background-color', '#3399FF');
        }
    });
    $element.blur(function() {
        var actualValue = $element.val();
        if (!actualValue) {
            $element.val(defaultValue);
            // $element.css('background-color', '#555555');
        }
    });
});
    
    

    });
         </script>
    </body>
</html>
